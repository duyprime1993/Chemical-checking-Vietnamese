import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SampleLoader } from "./components/SampleLoader";
import { Uploader } from "./components/Uploader";
import { DashboardView } from "./components/DashboardView";
import { AnalyticsHub } from "./components/AnalyticsHub";
import { DocumentVerificationResult } from "./types";
import { ShieldCheck, HelpCircle, FileText, Fingerprint } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'analytics'>('workspace');
  const [selectedId, setSelectedId] = useState<string | undefined>("sample-sgs-fake"); // default select first sample on start
  const [result, setResult] = useState<DocumentVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<DocumentVerificationResult[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Load history from localStorage and default sample on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai_audit_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Local history parse failed", e);
      }
    }
    
    // Automatically trigger analysis of default "sample-sgs-fake" so workspace doesn't look empty
    fetchSampleData("sample-sgs-fake");
  }, []);

  // Sync history to localStorage
  const saveHistory = (newHistory: DocumentVerificationResult[]) => {
    setHistory(newHistory);
    localStorage.setItem("ai_audit_history", JSON.stringify(newHistory));
  };

  const fetchSampleData = async (sampleId: string) => {
    setIsLoading(true);
    setSelectedId(sampleId);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        console.error("Sample load failed", data.message);
      }
    } catch (err) {
      console.error("Fetch sample sequence failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform forensic verification using live uploaded Base64 string
  const handleVerify = async (fileData: string, fileName: string, fileType: string, forceOffline?: boolean) => {
    setIsLoading(true);
    setResult(null);
    setSelectedId(undefined);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileType, fileData, forceOffline })
      });

      const data = await response.json();
      if (data.success) {
        const verifiedResult: DocumentVerificationResult = data.result;
        setResult(verifiedResult);
        
        // Prepends newly verified file into verification trail
        const updatedHistory = [verifiedResult, ...history];
        saveHistory(updatedHistory);
        return verifiedResult;
      } else {
        throw new Error(data.message || "Forensic analyzer rejected this file.");
      }
    } catch (e: any) {
      console.error("Live verify failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setSelectedId(undefined);
  };

  const handleSelectHistoryItem = (id: string) => {
    const found = history.find(h => h.id === id);
    if (found) {
      setResult(found);
      setSelectedId(found.id.startsWith("sample-") ? found.id : undefined);
      setActiveTab('workspace');
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleSaveFeedback = (verdict: 'GENUINE' | 'FAKE') => {
    if (!result) return;
    
    // Set feedback locally
    const updatedResult = { ...result, feedback: verdict };
    setResult(updatedResult);

    // Update inside list history as well
    const updatedHistory = history.map(item => {
      if (item.id === result.id) {
        return { ...item, feedback: verdict };
      }
      return item;
    });
    saveHistory(updatedHistory);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-500/10 selection:text-blue-900">
      {/* 1. Nav bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDemoMode={isDemoMode} 
      />

      {/* 2. Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'workspace' ? (
          <div className="space-y-6">
            
            {/* Split top structure - Sandbox simulator and manual intake */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-8">
                <SampleLoader 
                  onSelectSample={fetchSampleData} 
                  isLoading={isLoading} 
                  selectedId={selectedId} 
                />
              </div>

              <div className="lg:col-span-4">
                <Uploader 
                  onVerify={handleVerify} 
                  isLoading={isLoading} 
                  onClear={handleClear} 
                  result={result} 
                />
              </div>

            </div>

            {/* active reports panel */}
            {result ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 gap-2.5 text-xs shadow-sm">
                  <span className="font-mono text-slate-550 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Hồ sơ đang mở: <strong className="text-slate-800 font-sans">{result.fileName}</strong>
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleClear}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-all shadow-xs"
                    >
                      Đóng báo cáo này
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Xác nhận: Bạn có chắc chắn muốn xóa sạch hoàn toàn bộ nhớ đệm và toàn bộ lịch sử kiểm định đã nạp không? Hành động này không thể khôi phục.")) {
                          handleClearHistory();
                          handleClear();
                        }
                      }}
                      className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-100/100 cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                    >
                      Xóa tất cả dữ liệu kiểm định
                    </button>
                  </div>
                </div>

                <DashboardView 
                  result={result} 
                  onSaveFeedback={handleSaveFeedback} 
                />
              </div>
            ) : (
              !isLoading && (
                <div className="border border-slate-200 bg-white shadow-sm p-12 text-center rounded-xl max-w-xl mx-auto mt-6">
                  <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-800 font-display">Chưa nạp tệp dữ liệu phân tích hóa chất</h4>
                  <p className="text-xs text-slate-500 font-sans mt-2.5 max-w-sm mx-auto leading-relaxed">
                    Vui lòng chọn một kịch bản dữ liệu sai lệch từ hệ thống giả lập bên trên hoặc kéo thả tệp hóa chất (PDF, JPG, PNG) thực tế vào ô nhận diện để AI kiểm tra đối chứng tự động.
                  </p>
                </div>
              )
            )}

            {/* Help Block Container - Industrial Forensic Indicators guide */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mt-8 max-w-7xl mx-auto shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-1.5 font-bold">
                <HelpCircle className="h-4 w-4 text-blue-500" /> Bản Chất Các Tín Hiệu Pháp Y Kỹ Thuật Số Trong Kiểm Định Dệt May
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-500">
                <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-150">
                  <span className="text-slate-800 font-extrabold block">1. Lỗi Đè Phủ Phông Chữ (Font Overlays)</span>
                  <span className="leading-relaxed">Các tài liệu bị giả mạo thường chỉnh sửa các giá trị số và kết quả trực tiếp trên tệp PDF (như PASS thành FAIL hoặc đổi lượng hàm lượng hóa chất). Việc này xâm hại đến các cấu trúc vector chữ nhúng bảo mật LIMS ban đầu.</span>
                </div>
                <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-150">
                  <span className="text-slate-800 font-extrabold block">2. Bản Đồ Hóa Chất Mã CAS (CAS Mappings)</span>
                  <span className="leading-relaxed">Một số nhà cung cấp thường tìm cách đổi tên các chất cấm nguy hại thuộc danh mục MRSL thành tên chất lành tính, hoặc dùng mã CAS của dung môi thông thường nhằm che mắt kiểm định viên.</span>
                </div>
                <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-150">
                  <span className="text-slate-800 font-extrabold block">3. Chữ Ký XML & Siêu Dữ Liệu Tệp (File Metadata)</span>
                  <span className="leading-relaxed">Tệp PDF chính quy được xuất tự động từ hệ thống máy chủ của lab uy tín (SGS, TUV, Intertek). Mọi thao tác chỉnh sửa thủ công bằng Photoshop hay vẽ lại con dấu đều để lại dấu vết chỉnh sửa cấu trúc XML đặc trưng.</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <AnalyticsHub 
            history={history} 
            onClearHistory={handleClearHistory} 
            onSelectHistoryItem={handleSelectHistoryItem} 
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[10px] text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="font-medium">Hệ Thống AI Giám Định Hồ Sơ Hóa Chất & Tiêu Chuẩn Bền Vững Dệt May © 2026.</span>
          <span className="text-slate-400 font-semibold text-[9px] uppercase tracking-wider">Hệ thống an toàn khép kín • Bảo mật kiểm thấu SHA-256</span>
        </div>
      </footer>
    </div>
  );
}
