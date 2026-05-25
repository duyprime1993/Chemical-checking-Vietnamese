import React from "react";
import { ShieldCheck, ShieldAlert, FileSearch, Database, Activity } from "lucide-react";

interface HeaderProps {
  activeTab: 'workspace' | 'analytics';
  setActiveTab: (tab: 'workspace' | 'analytics') => void;
  isDemoMode: boolean;
}

export function Header({ activeTab, setActiveTab, isDemoMode }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0f172a] px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded flex items-center justify-center text-white shadow-inner">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-display font-bold tracking-tight text-white uppercase">
                Hệ Thống Kiểm Định Verifeye
              </h1>
              <span className="text-[9px] uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-bold">
                BẢN KIỂM TOÁN v1.0.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Điều tra mức độ tuân thủ hóa chất kỹ thuật số • Phân tích tài liệu pháp y theo thời gian thực
            </p>
          </div>
        </div>

        {/* Navigation & Live Stats */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Navigation Control */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-md">
            <button
              id="tab-workpace-btn"
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'workspace'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <FileSearch className="h-3.5 w-3.5" />
              Kiểm Định Trực Tiếp
            </button>
            <button
              id="tab-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Lịch Sử & Thống Kê
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 border-l border-slate-800 pl-4 font-mono text-[11px]">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Trạng Thái Hệ Thống</span>
              <span className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                <Database className="h-3.5 w-3.5 text-blue-400" /> 
                Đồng bộ ZDHC Đang chạy
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Xác Thực Ngoại Vi</span>
              <span className="text-emerald-400 font-medium text-[10px] flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Kết nối GOTS & ECHA
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
