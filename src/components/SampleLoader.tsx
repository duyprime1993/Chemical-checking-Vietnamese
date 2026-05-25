import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, CornerDownRight } from "lucide-react";
import { DocumentVerificationResult } from "../types";

interface SampleLoaderProps {
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
  selectedId?: string;
}

export function SampleLoader({ onSelectSample, isLoading, selectedId }: SampleLoaderProps) {
  const samples = [
    {
      id: "sample-sgs-fake",
      title: "Báo Cáo Thử Nghiệm SGS (Giả Mạo)",
      verdict: "FALSIFIED", // user specified VERDICT values are mapped, but we will make UI badges readable in VN
      verdictLabel: "GIẢ MẠO",
      score: 92,
      subtitle: "Sử dụng mã CAS ngụy trang để che giấu các chất cấm nguy hại",
      checks: ["Sai lệch font chữ chuẩn nghiêm trọng", "Dấu vết kết xuất XML từ Adobe / Canva", "Lỗi logic: số CAS 108-87-2 không khớp tên hóa chất"],
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      icon: <ShieldAlert className="h-5 w-5 text-red-600" />
    },
    {
      id: "sample-gots-suspicious",
      title: "Thư Phê Duyệt GOTS (Nghi Vấn)",
      verdict: "SUSPICIOUS",
      verdictLabel: "NGHI VẤN",
      score: 58,
      subtitle: "Báo cáo bị lệch mốc thời gian và chứng chỉ hết hiệu lực",
      checks: ["Mốc ngày kiểm định nằm ở tương lai", "Mã đăng ký Siam Chem đã bị đình chỉ", "Sự hiện diện của chất cực kỳ nguy hại (SVHC) Borax"],
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
    },
    {
      id: "sample-bluesign-genuine",
      title: "Công Thức bluesign (Chuẩn Hợp Quy)",
      verdict: "GENUINE",
      verdictLabel: "HỢP QUY",
      score: 12,
      subtitle: "Sự trùng khớp tuyệt đối về cơ sở dữ liệu và chữ ký số chuẩn",
      checks: ["Tọa độ căn lề văn bản hoàn toàn tự nhiên", "Xác minh dung môi Ethyl Acetate an toàn", "Khớp cổng đăng ký xác thực trung tâm bluesign"],
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display">
            Môi Trường Giả Lập Kiểm Định (Sandbox)
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Tải nhanh các mô hình gian lận thực tế thường thấy trong ngành dệt may để trải nghiệm ứng dụng
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
          ⚡ Đang Chạy Chế Độ Giả Lập
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {samples.map((sample) => {
          const isSelected = selectedId === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              disabled={isLoading}
              className={`text-left p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/30 shadow-sm outline-none'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div>
                {/* Header block with visual score indicators */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    {sample.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-solid ${sample.badgeColor}`}>
                      {sample.verdictLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      RISK: {sample.score}%
                    </span>
                  </div>
                </div>

                {/* Sub titles */}
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-1 italic font-sans min-h-[32px]">
                  &ldquo;{sample.subtitle}&rdquo;
                </p>

                {/* Simulated Audit features */}
                <div className="mt-3.5 space-y-1.5">
                  {sample.checks.map((chk, idx) => (
                    <div key={idx} className="flex items-start text-[10px] text-slate-550 font-mono">
                      <CornerDownRight className="h-3 w-3 text-blue-500 mt-0.5 shrink-0 mr-1" />
                      <span className="line-clamp-1">{chk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loader button footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  Chạy Thử Nghiệm Mẫu này
                  <ArrowRight className="h-3 w-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
