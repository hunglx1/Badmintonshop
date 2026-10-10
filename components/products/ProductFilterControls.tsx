"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";

interface Props {
  total: number;
  currentSort?: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "name", label: "Tên A – Z" },
];

export default function ProductFilterControls({ total, currentSort = "newest" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  function handleSortChange(newSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6">
      {/* Product count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900">
          Hiển thị <strong className="text-red-600">{total}</strong> sản phẩm
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Mobile Filter Button */}
        <button
          onClick={() => {
            const sidebar = document.getElementById("product-filter-sidebar");
            sidebar?.scrollIntoView({ behavior: "smooth" });
          }}
          type="button"
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Bộ lọc</span>
        </button>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sắp xếp:</span>
          <select
            value={currentSort || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 outline-none transition focus:border-red-600 focus:bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

