import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, Image, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { DocumentVerificationResult } from "../types";

interface UploaderProps {
  onVerify: (fileData: string, fileName: string, fileType: string, forceOffline?: boolean) => Promise<any>;
  isLoading: boolean;
  onClear: () => void;
  result: DocumentVerificationResult | null;
}

export function Uploader({ onVerify, isLoading, onClear, result }: UploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated visual stepping sequence during Gemini execution
  const runSimulatedSteps = async () => {
    const steps = [
      "🔄 Khởi động quy trình kiểm tra viên pháp lý số hóa...",
      "🔍 Đọc tọa độ cấu trúc văn bản: Trích xuất số đăng ký CAS...",
      "🚨 Đánh giá chéo hóa chất: Đối chiếu chuỗi kí tự chất cấm với dữ liệu IUPAC...",
      "🧬 Thẩm định chỉ số an toàn: Rà soát ngưỡng nồng độ chuẩn GOTS/ZDHC v3...",
      "💾 Quét sâu siêu dữ liệu XML, EXIF và các lớp Photoshop sửa đổi...",
      "🧩 Tổng hợp biểu đồ rủi ro pháp y..."
    ];

    for (let i = 0; i < steps.length; i++) {
      if (!isLoading) {
        setProcessStep("");
        break;
      }
      setProcessStep(steps[i]);
      // Sleep briefly between steps for maximum visual clarity
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  };

  // Trigger step updates when loading state changes
  React.useEffect(() => {
    if (isLoading) {
      runSimulatedSteps();
    } else {
      setProcessStep("");
    }
  }, [isLoading]);

  // Handle file base64 parsing
  const processSelectedFile = (file: File) => {
    setErrorText(null);

    // Validate size and extension before launching API calls
    const validMimes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg"
    ];

    if (!validMimes.includes(file.type)) {
      setErrorText("Định dạng không hỗ trợ. Vui lòng chọn tệp PDF, JPG hoặc PNG Kiểm Định.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorText("Kích thước tệp tin quá lớn (Tối đa là 12MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          await onVerify(reader.result, file.name, file.type, offlineMode);
        } catch (e: any) {
          setErrorText(e.message || "Quá trình thẩm định lỗi. Vui lòng kiểm tra lại kết nối mạng.");
        }
      }
    };
    reader.onerror = () => {
      setErrorText("Không thể đọc dòng nhị phân từ tệp tin cục bộ.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-slate-800 font-display">
          Cổng Tải Tài Liệu Lên
        </h3>
        {result && (
          <button
            onClick={onClear}
            className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 transition-all cursor-pointer"
          >
            Xóa Kết Quả Hiện Tại
          </button>
        )}
      </div>

      {/* Selector: Deep AI vs Local Heuristics */}
      <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg flex items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            Chế độ: <strong className={offlineMode ? "text-indigo-600 font-sans" : "text-blue-600 font-sans"}>{offlineMode ? "Cục bộ (Siêu tốc)" : "AI Cloud (Nâng cao)"}</strong>
          </span>
          <span className="text-[10px] text-slate-500 leading-normal">{offlineMode ? "Chạy xử lý nội tại, bỏ qua độ trễ API" : "Phân tích kịch bản bằng Gemini AI"}</span>
        </div>
        <button
          type="button"
          onClick={() => setOfflineMode(!offlineMode)}
          disabled={isLoading}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${offlineMode ? 'bg-indigo-600' : 'bg-slate-200'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${offlineMode ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {isLoading ? (
        <div className="border border-slate-200 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center min-h-[220px]">
          <div className="relative mb-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <div className="absolute inset-0 bg-blue-500/10 blur-md rounded-full"></div>
          </div>
          <h4 className="text-sm font-bold font-display text-slate-800 animate-pulse">
            Đang Kiểm Định Pháp Y Đa Tác Vụ AI
          </h4>
          <p className="text-[11px] text-slate-550 max-w-md text-center mt-2 font-mono h-8 leading-normal">
            {processStep || "Đang kết nối robot kiểm định..."}
          </p>

          <div className="w-full max-w-sm bg-slate-200 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onBrowseClick}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px] relative overflow-hidden group ${
            isDragActive
              ? "border-blue-500 bg-blue-50/40"
              : "border-slate-200 bg-slate-50/30 hover:border-slate-350 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
          />

          <div className="bg-white p-4 rounded-full border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition-all shadow-sm relative mb-3">
            <UploadCloud className="h-8 w-8 text-blue-500" />
          </div>

          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
            Kéo thả hoặc Chọn Tệp Hóa Chất ở đây
          </h4>
          <p className="text-[11px] text-slate-550 text-center max-w-md mt-1 leading-relaxed font-sans">
            Hỗ trợ file PDF gốc, tệp ảnh quét kết quả thử nghiệm lab hoặc ảnh chụp báo cáo hóa chất rõ nét (SGS, BV, Control Union, Intertek tối đa 12MB)
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PDF</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">JPG</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PNG</span>
          </div>
        </div>
      )}

      {errorText && (
        <div className="mt-3 bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg flex items-start gap-2.5 text-xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800">Chuỗi Thẩm Định Bị Hoãn</p>
            <p className="mt-0.5 text-red-600">{errorText}</p>
          </div>
        </div>
      )}

      {!isLoading && !result && (
        <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center gap-2 font-sans font-medium">
            <ShieldAlert className="h-4 w-4 text-blue-600" />
            <span>Kéo thả chứng thư hoặc chọn nhanh một tệp giả định định dạng bên cạnh để bắt đầu chẩn đoán.</span>
          </div>
        </div>
      )}
    </div>
  );
}
