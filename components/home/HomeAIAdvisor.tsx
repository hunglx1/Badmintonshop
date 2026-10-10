"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, Flame, CheckCircle2 } from "lucide-react";

interface AdvisorOption {
  id: string;
  label: string;
  desc: string;
  icon: any;
  slugFilter: string;
  recommendedModels: string[];
}

const PLAY_STYLES: AdvisorOption[] = [
  {
    id: "attack",
    label: "Tấn công áp đảo (Smash)",
    desc: "Đập cầu uy lực, đè cầu cuối sân, thích hợp người chơi có lực cổ tay tốt.",
    icon: Flame,
    slugFilter: "/products?category=vot-cau-long&search=Astrox",
    recommendedModels: ["Yonex Astrox 100ZZ", "Yonex Astrox 88D Pro", "Victor Thruster Ryuga", "Lining Axforce 90"],
  },
  {
    id: "balanced",
    label: "Công thủ toàn diện",
    desc: "Kiểm soát nhịp độ trận đấu, điều cầu chính xác, linh hoạt chuyển trạng thái.",
    icon: Shield,
    slugFilter: "/products?category=vot-cau-long&search=Arcsaber",
    recommendedModels: ["Yonex Arcsaber 11 Pro", "Yonex Astrox 77 Pro", "Lining DriveX 10", "Victor Thruster F"],
  },
  {
    id: "speed",
    label: "Tốc độ & Phản tạt nhanh",
    desc: "Bắt lưới chớp nhoáng, tạt cầu nhanh, thích hợp đánh đôi và phản xạ cự ly gần.",
    icon: Zap,
    slugFilter: "/products?category=vot-cau-long&search=Nanoflare",
    recommendedModels: ["Yonex Nanoflare 1000Z", "Victor Auraspeed 100X", "Lining BladeX 900", "Victor Auraspeed 90K"],
  },
];

const SKILL_LEVELS = [
  { id: "beginner", label: "Mới chơi / Nhập môn", hint: "Nên chọn vợt 4U/5U, thân dẻo, dễ thuần" },
  { id: "intermediate", label: "Phong trào (1-3 năm)", hint: "Thân trung bình, cân bằng hoặc hơi nặng đầu" },
  { id: "advanced", label: "Bán chuyên / Nâng cao", hint: "Thân cứng (Stiff), vợt nặng 3U/4U, tension cao" },
];

export default function HomeAIAdvisor() {
  const [selectedStyle, setSelectedStyle] = useState<string>("attack");
  const [selectedLevel, setSelectedLevel] = useState<string>("intermediate");

  const currentStyle = PLAY_STYLES.find((s) => s.id === selectedStyle) || PLAY_STYLES[0];

  return (
    <div id="ai-advisor" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-red-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-slate-100/80 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
              <Sparkles className="h-3.5 w-3.5 text-red-600" />
              Trợ Lý Kỹ Thuật AI
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tìm Cây Vợt Chuẩn Lối Chơi Của Bạn
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Hệ thống gợi ý thông minh dựa trên lối đánh, trình độ và thông số vợt (trọng lượng, điểm cân bằng, độ cứng).
            </p>
          </div>

          <Link
            href="/products?category=vot-cau-long"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 self-start md:self-auto"
          >
            Xem tất cả 30+ mẫu vợt <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Step 1: Select play style */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Bước 1: Chọn phong cách thi đấu của bạn
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLAY_STYLES.map((style) => {
              const Icon = style.icon;
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? "border-red-600 bg-red-50/40 shadow-sm ring-1 ring-red-600/30"
                      : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-red-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-red-600" />}
                  </div>
                  <span className="font-bold text-slate-900 text-base">{style.label}</span>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{style.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select skill level */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Bước 2: Trình độ hiện tại
          </label>
          <div className="flex flex-wrap gap-3">
            {SKILL_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setSelectedLevel(level.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result recommendation box */}
        <div className="mt-8 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50/70 to-slate-50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">Gợi ý dành riêng cho bạn:</span>
              <span className="text-xs font-medium text-slate-500">
                ({SKILL_LEVELS.find((l) => l.id === selectedLevel)?.hint})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentStyle.recommendedModels.map((model) => (
                <span
                  key={model}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={currentStyle.slugFilter}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-red-700 hover:shadow-lg active:scale-95"
          >
            <span>Khám phá các mẫu này</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

