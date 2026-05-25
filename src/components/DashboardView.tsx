import React, { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Info, Calendar, Building2, 
  MapPin, Award, CheckCircle2, XCircle, Search, ThumbsUp, ThumbsDown,
  HelpCircle, ChevronRight, FileSpreadsheet, ServerCrash, Fingerprint
} from "lucide-react";
import { DocumentVerificationResult, RedFlag, ChemicalCheck, DatabaseCheck } from "../types";

interface DashboardViewProps {
  result: DocumentVerificationResult;
  onSaveFeedback: (verdict: 'GENUINE' | 'FAKE') => void;
}

export function DashboardView({ result, onSaveFeedback }: DashboardViewProps) {
  const [feedbackSaved, setFeedbackSaved] = useState<'GENUINE' | 'FAKE' | null>(result.feedback || null);

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "FAKE":
        return {
          textColor: "text-red-700",
          borderAndBg: "border-red-200 bg-red-50/60",
          glowColor: "glow-red",
          label: "CÓ KHẢ NĂNG CAO LÀ GIẢ MẠO",
          desc: "Phát hiện chỉ số gian lận nghiêm trọng trong cấu trúc tệp. Khuyến nghị thẩm định pháp lý thủ công."
        };
      case "SUSPICIOUS":
        return {
          textColor: "text-amber-700",
          borderAndBg: "border-amber-200 bg-amber-50/60",
          glowColor: "glow-yellow",
          label: "CHỨNG THƯ CHỨA NGHI VẤN",
          desc: "Phát hiện điểm bất thường về sai lệch căn lề font chữ, mốc thời gian mâu thuẫn hoặc mã số định danh."
        };
      default:
        return {
          textColor: "text-emerald-700",
          borderAndBg: "border-emerald-200 bg-emerald-50/40",
          glowColor: "glow-green",
          label: "TÀI LIỆU CÓ THỂ LÀ CHUẨN THẬT",
          desc: "Ủy ban chấm điểm ghi nhận các đặc trưng căn lề, công thức hóa học và tệp siêu dữ liệu hoàn toàn khớp tiêu chuẩn."
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const handleFeedback = (type: 'GENUINE' | 'FAKE') => {
    setFeedbackSaved(type);
    onSaveFeedback(type);
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="space-y-6">
      {/* Engine Source Banner */}
      {result.source === "local-heuristic-bypass" && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-800 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs">
          <div className="p-1 px-2 font-mono font-bold bg-amber-500 text-white rounded text-[10px] shrink-0 uppercase tracking-wider">
            Bypass Cục Bộ
          </div>
          <div className="leading-relaxed">
            Hệ thống đã kích hoạt cơ chế <strong>Giám định Cục bộ (Bản đồ Hóa học Nội tại)</strong> để thẩm định tệp tin này ngay lập tức. Tính năng này tự động kích hoạt khi mạng/máy chủ AI đám mây quá tải nhằm đảm bảo tiến trình chẩn đoán không gián đoạn.
          </div>
        </div>
      )}

      {result.source === "gemini-api" && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-800 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs">
          <div className="p-1 px-2 font-mono font-bold bg-blue-600 text-white rounded text-[10px] shrink-0 uppercase tracking-wider">
            Gemini Core v3.5
          </div>
          <div className="leading-relaxed">
            Hệ thống đã sử dụng mô hình <strong>Deep AI Cloud (Phông chữ &amp; Cấu trúc Vector)</strong> của Gemini 3.5 để tiến hành giám định pháp y văn bản toàn diện.
          </div>
        </div>
      )}

      {/* 1. Main Inspection Ribbon */}
      <div className={`p-6 rounded-xl border relative overflow-hidden transition-all duration-300 ${styles.borderAndBg} ${styles.glowColor}`}>
        <div className="absolute right-0 top-0 h-48 w-48 bg-gradient-to-bl from-slate-200/50 to-transparent pointer-events-none rounded-full blur-2xl"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm ${styles.textColor}`}>
              {result.verdict === "FAKE" ? (
                <ShieldAlert className="h-8 w-8 text-red-600 animate-pulse" />
              ) : result.verdict === "SUSPICIOUS" ? (
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-emerald-600 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${styles.borderAndBg} ${styles.textColor}`}>
                  Kết Luận AI: {styles.label}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-medium font-bold">
                  Độ Tin Cậy: {result.confidence}%
                </span>
              </div>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-1.5 flex items-center gap-2">
                {result.fileName}
                <span className="text-xs text-slate-500 font-mono font-normal">
                  ({result.fileSize || "N/A"})
                </span>
              </h2>
              <p className="text-xs text-slate-650 mt-1 max-w-2xl font-sans leading-relaxed">
                {styles.desc}
              </p>
            </div>
          </div>

          {/* Quick Score Meter */}
          <div className="flex items-center gap-5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto shrink-0 justify-around">
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-extrabold">Chỉ Số Rủi Ro</span>
              <p className={`text-3xl font-display font-extrabold ${styles.textColor} mt-1`}>
                {result.overallScore}%
              </p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-extrabold">Kết Quả Kiểm Thẩm</span>
              <span className={`block text-xs font-mono font-bold mt-2 px-2.5 py-0.5 rounded border ${styles.textColor} ${styles.borderAndBg}`}>
                {result.overallScore > 60 ? "REJECTED (TỪ CHỐI)" : result.overallScore > 30 ? "SUSPENDED (TẠM HOÃN)" : "APPROVED (DUYỆT)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dual Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core Scores, Extracted Metadata, and PDF Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed Metric Radar Bar Charts */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-3 mb-4">
              🛡️ Phân Tích Rủi Ro Pháp Y Chi Tiết
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Sự Đồng Nhất Bố Cục & Độ Căn Lề Ký Tự", value: result.visualScore },
                { name: "Logic Công Thức Phân Tử & Khớp Mã CAS", value: result.chemicalScore },
                { name: "Đối Chiếu Cơ Sở Dữ Liệu Trung Tâm", value: result.databaseScore },
                { name: "Toàn Vẹn Siêu Dữ Liệu Meta & XML Tệp Tin", value: result.metadataScore },
                { name: "Kiểm Tra Con Dấu & Sao Chép Chữ Ký Số", value: result.signatureScore }
              ].map((metric, i) => {
                const barColor = metric.value > 60 ? "bg-red-500" : metric.value > 30 ? "bg-amber-500" : "bg-emerald-500";
                return (
                  <div key={i} className="text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                      <span className="text-slate-600 font-sans font-medium">{metric.name}</span>
                      <span className="text-slate-800 font-bold">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                      <div className={`${barColor} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${metric.value}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-150 text-[11px] text-slate-500 leading-relaxed font-sans">
              <Info className="h-3.5 w-3.5 text-blue-500 inline shrink-0 mr-1.5 -mt-0.5" />
              Chỉ số rủi ro phản ánh xác suất phát hiện sửa đổi kỹ thuật số. Điểm kiểm tra trên 61% sẽ nhận cảnh báo dừng sử dụng hóa chất ngay lập tức.
            </div>
          </div>

          {/* Extracted Certificate Entity Block */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-3 mb-4">
              📋 Thông Tin Chứng Thư Trích Xuất
            </h3>

            <div className="space-y-3">
              {[
                { label: "Lab Thử Nghiệm / Đơn vị cấp", value: result.extractedEntities.labName, icon: <Building2 className="h-3.5 w-3.5" /> },
                { label: "Mã Báo Cáo Lab", value: result.extractedEntities.reportNumber, icon: <Fingerprint className="h-3.5 w-3.5" /> },
                { label: "Mã Số Chứng Thư", value: result.extractedEntities.certificateNumber, icon: <Award className="h-3.5 w-3.5" /> },
                { label: "Tập Thể Được Đo lường", value: result.extractedEntities.companyName, icon: <Building2 className="h-3.5 w-3.5" /> },
                { label: "Nhà Cung Cấp Hóa Chất", value: result.extractedEntities.supplier, icon: <MapPin className="h-3.5 w-3.5" /> },
                { label: "Ngày Thực Hiện Đánh Giá", value: result.extractedEntities.testingDate, icon: <Calendar className="h-3.5 w-3.5" /> },
                { label: "Ngày Hết Hạn Chứng Thư", value: result.extractedEntities.expiryDate, icon: <Calendar className="h-3.5 w-3.5" /> },
                { label: "Tiêu Chuẩn Phát Thải", value: result.extractedEntities.mrslVersion, icon: <ShieldCheck className="h-3.5 w-3.5" /> }
              ].map((ent, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 last:border-none">
                  <span className="text-slate-500 shrink-0 flex items-center gap-1.5 font-sans">
                    {React.cloneElement(ent.icon, { className: "h-3.5 w-3.5 text-slate-400" })}
                    {ent.label}
                  </span>
                  <span className="text-slate-800 font-mono text-right truncate pl-4 font-bold">
                    {ent.value && ent.value !== "N/A" ? ent.value : <em className="text-slate-400 font-normal">Không tìm thấy</em>}
                  </span>
                </div>
              ))}
            </div>

            {/* Electronic Stamp Detection Badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
              {[
                { label: "Chữ Ký", detected: result.extractedEntities.signatureFound },
                { label: "Mã QR", detected: result.extractedEntities.qrCodeFound },
                { label: "Dấu Mộc Lab", detected: result.extractedEntities.stampFound }
              ].map((seal, index) => (
                <div key={index} className={`p-2 rounded-lg border text-center font-mono ${
                  seal.detected 
                    ? 'border-blue-200 bg-blue-50/50 text-blue-700' 
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}>
                  <p className="text-[9px] uppercase tracking-wider font-semibold">{seal.label}</p>
                  <p className="text-[10px] font-bold mt-1">{seal.detected ? "PHÁT HIỆN" : "KHÔNG CÓ"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded File Metadata Details */}
          {result.metadataInfo && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
              <h3 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-3 mb-3">
                🗂️ Siêu Dữ Liệu Đầu File (EXIF/XML Header)
              </h3>
              <div className="space-y-2 font-mono text-[10px]">
                {Object.entries(result.metadataInfo).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-100 pb-1.5 border-dashed">
                    <span className="text-slate-450">{key}</span>
                    <span className="text-slate-700 truncate max-w-xs font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Detailed Red Flags, Chemical Matrix, and Cross-DB Queries */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Action Recommendation */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 text-white shadow-md">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2 font-bold">
              ⚖️ Đề Xuất Hành Động Hệ Thống
            </h3>
            <p className="text-xs text-slate-200 bg-slate-800/50 py-3.5 px-4 rounded-lg border border-slate-700/50 leading-relaxed font-sans">
              <span className="font-semibold text-blue-400 block mb-1">Khuyến nghị trực tiếp cho kiểm định viên:</span>
              {result.recommendation}
            </p>

            {/* Human in the loop confirmation button */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-850">
              <span className="text-xs text-slate-400 font-sans">Giúp cải thiện AI. Đánh giá chất lượng tài liệu này:</span>
              {feedbackSaved ? (
                <span className="text-xs font-mono bg-blue-600/15 border border-blue-500/35 text-blue-400 py-1.5 px-3 rounded-lg">
                  🏆 Đã ghi nhận! Đánh dấu &ldquo;{feedbackSaved === "GENUINE" ? "CHUẨN THẬT" : "GIẢ MẠO/SAI LỆCH"}&rdquo;
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeedback('GENUINE')}
                    className="flex items-center gap-1 bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/35 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> Chuẩn Thật ✔
                  </button>
                  <button
                    onClick={() => handleFeedback('FAKE')}
                    className="flex items-center gap-1 bg-red-650/15 text-red-400 border border-red-500/30 hover:bg-red-650/35 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" /> Có dấu hiệu giả tệp ❌
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Red Flags Module */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3 font-display">
              ⚠️ Danh Sách Điểm Cảnh Báo Bản Sửa Đổi ({result.redFlags.length})
            </h3>
            {result.redFlags.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                Không phát hiện dấu hiệu bất thường về hiển thị hay chữ viết. Tài liệu hiển thị tính toàn vẹn cao.
              </div>
            ) : (
              <div className="space-y-4">
                {result.redFlags.map((flag) => (
                  <div key={flag.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-mono font-bold border px-2 py-0.5 rounded leading-none ${getSeverityBadge(flag.severity)}`}>
                          Mức {flag.severity === "high" ? "Cao" : flag.severity === "medium" ? "Trung bình" : "Thấp"}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded leading-none uppercase">
                          HẠNG MỤC: {flag.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-450">ID: {flag.id}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">{flag.title}</h4>
                    <p className="text-xs text-slate-650 mt-1 font-sans leading-relaxed">{flag.description}</p>
                    <div className="mt-2.5 p-2 bg-slate-100 rounded text-[10px] font-mono text-slate-600 border border-slate-200">
                      <span className="text-blue-600 font-bold uppercase mr-1">Bằng chứng kỹ thuật số:</span> {flag.evidence}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CAS and Substance Chemical Compliance Registry */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display">
                  ☣️ Sổ Đăng Ký Kiểm Tuân Thủ Hóa Chất (CAS Matrix)
                </h3>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Đối chiếu cấu trúc danh mục với cơ sở dữ liệu hạn chế ZDHC MRSL v3.0, ECHA SVHC và GOTS dệt may
                </p>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded font-mono font-bold uppercase">
                Số Hóa Chất Mã CAS: {result.chemicalChecks.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-250 text-slate-500 font-mono grid grid-cols-12 gap-2 pb-2 font-bold">
                    <th className="col-span-2">Mã CAS</th>
                    <th className="col-span-4">Tên Hợp Chất Hóa Học</th>
                    <th className="col-span-2 text-center">Khớp Danh Pháp</th>
                    <th className="col-span-2">Tiêu chuẩn ZDHC / GOTS</th>
                    <th className="col-span-2 text-right">Hệ Số Rủi Ro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {result.chemicalChecks.map((chem, idx) => (
                    <tr key={idx} className="grid grid-cols-12 gap-2 py-3 items-center hover:bg-slate-50/60 transition-colors">
                      
                      <td className="col-span-2 font-mono text-slate-800 font-bold">{chem.cas}</td>
                      
                      <td className="col-span-4 font-sans text-slate-850">
                        <p className="font-bold">{chem.chemicalName}</p>
                        <p className="text-[10px] text-slate-500 italic mt-0.5 leading-snug line-clamp-1">{chem.note}</p>
                      </td>
                      
                      <td className="col-span-2 text-center">
                        <span className={`inline-flex items-center text-[10px] px-2.5 py-0.5 border rounded-full font-mono font-bold ${
                          chem.matchesCasName 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {chem.matchesCasName ? "CHÍNH XÁC" : "SAI LỆCH"}
                        </span>
                      </td>
                      
                      <td className="col-span-2 text-[10px] font-mono space-y-0.5">
                        <div className="flex justify-between pr-2 border-b border-slate-100 text-slate-500">
                          <span>ZDHC:</span>
                          <span className={chem.zdhcLevel === "Banned" || chem.zdhcLevel === "Restricted" ? "text-red-600 font-bold" : "text-slate-700 font-medium"}>
                            {chem.zdhcLevel || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between pr-2 text-slate-500">
                          <span>GOTS:</span>
                          <span className={chem.gotsApproval === "Prohibited" || chem.gotsApproval === "Restricted" ? "text-red-600 font-bold" : "text-slate-700 font-medium"}>
                            {chem.gotsApproval || "N/A"}
                          </span>
                        </div>
                      </td>
                      
                      <td className="col-span-2 text-right">
                        <span className={`inline-block font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          chem.riskLevel === "high" 
                            ? 'text-red-700 bg-red-50 border border-red-200' 
                            : chem.riskLevel === "medium" 
                            ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                            : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        }`}>
                          {chem.riskLevel === "high" ? "NGUY HẠI" : chem.riskLevel === "medium" ? "CẢNH BÁO" : "AN TOÀN"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Verification Logs */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-4">
              🌐 Kết Quả Truy Vấn Dữ Liệu Xác Thực Ngoại Vi
            </h3>

            <div className="space-y-3 font-mono text-[11px]">
              {result.databaseChecks.map((query, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] block font-bold">Cơ Sở Dữ Liệu Đối Chiếu</span>
                    <span className="text-slate-800 font-bold font-sans">{query.source}</span>
                    <span className="text-slate-505 text-[10px] block mt-0.5">Mục kiểm tra: {query.checkedItem}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-medium hidden md:inline">{query.details}</span>

                    <span className={`px-2.5 py-0.5 text-[9px] uppercase font-bold border rounded ${
                      query.status === "MATCH" 
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50' 
                        : query.status === "MISMATCH" 
                        ? 'border-amber-200 text-amber-700 bg-amber-50/50' 
                        : 'border-red-200 text-red-700 bg-red-50/50'
                    }`}>
                      {query.status === "MATCH" ? "KHỚP DỮ LIỆU" : query.status === "MISMATCH" ? "LỆCH THÔNG TIN" : "KHÔNG TÌM THẤY"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
