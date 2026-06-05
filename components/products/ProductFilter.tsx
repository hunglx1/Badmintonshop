"use client";

// components/products/ProductFilter.tsx
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

const CATEGORIES = [
  { label: "Tất cả",        slug: "" },
  { label: "Vợt cầu lông",  slug: "vot-cau-long" },
  { label: "Giày cầu lông", slug: "giay-cau-long" },
  { label: "Túi / Balo",    slug: "tui-cau-long" },
  { label: "Dây cước",      slug: "day-cuoc" },
  { label: "Phụ kiện",      slug: "phu-kien" },
];

const BRANDS = ["Yonex", "Victor", "Lining", "Mizuno", "Apacs", "Kawasaki"];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: "",        max: "" },
  { label: "Dưới 500k",      min: "0",       max: "500000" },
  { label: "500k – 1 triệu", min: "500000",  max: "1000000" },
  { label: "1 – 2 triệu",    min: "1000000", max: "2000000" },
  { label: "2 – 4 triệu",    min: "2000000", max: "4000000" },
  { label: "Trên 4 triệu",   min: "4000000", max: "" },
];

// Icon SVGs nhỏ gọn
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function Section({
  title, children, defaultOpen = true,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        {title}
        <ChevronIcon open={open} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function ProductFilter() {
  const router        = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const [, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") || "";
  const activeBrands   = searchParams.getAll("brand");
  const activeMin      = searchParams.get("minPrice") || "";
  const activeMax      = searchParams.get("maxPrice") || "";

  // Tạo URL mới với params đã cập nhật
  const createURL = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page về 1 khi filter thay đổi
      params.set("page", "1");

      Object.entries(updates).forEach(([key, val]) => {
        params.delete(key);
        if (Array.isArray(val)) {
          val.forEach((v) => params.append(key, v));
        } else if (val !== null && val !== "") {
          params.set(key, val);
        }
      });
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const push = (url: string) =>
    startTransition(() => router.push(url, { scroll: false }));

  // ─── Handlers ───────────────────────────────
  const onCategory = (slug: string) =>
    push(createURL({ category: slug || null }));

  const onBrand = (brand: string) => {
    const next = activeBrands.includes(brand)
      ? activeBrands.filter((b) => b !== brand)
      : [...activeBrands, brand];
    push(createURL({ brand: next }));
  };

  const onPriceRange = (min: string, max: string) =>
    push(createURL({ minPrice: min || null, maxPrice: max || null }));

  const onReset = () =>
    push(pathname);

  const hasFilter =
    activeCategory || activeBrands.length > 0 || activeMin || activeMax;

  // ─── Render ─────────────────────────────────
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Bộ lọc</h2>
          {hasFilter && (
            <button
              onClick={onReset}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Xoá tất cả
            </button>
          )}
        </div>

        {/* ── Danh mục ── */}
        <Section title="Danh mục">
          <ul className="space-y-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    onClick={() => onCategory(cat.slug)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-blue-600 font-semibold text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-base">{categoryIcon(cat.slug)}</span>
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ── Thương hiệu ── */}
        <Section title="Thương hiệu">
          <ul className="space-y-2">
            {BRANDS.map((brand) => {
              const checked = activeBrands.includes(brand);
              return (
                <li key={brand}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onBrand(brand)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {brand}
                  </label>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ── Khoảng giá ── */}
        <Section title="Khoảng giá">
          <ul className="space-y-1">
            {PRICE_RANGES.map((r) => {
              const active = activeMin === r.min && activeMax === r.max;
              return (
                <li key={r.label}>
                  <button
                    onClick={() => onPriceRange(r.min, r.max)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                    )}
                    {r.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>
    </aside>
  );
}

function categoryIcon(slug: string) {
  switch (slug) {
    case "vot-cau-long":  return "🏸";
    case "giay-cau-long": return "👟";
    case "tui-cau-long":  return "🎒";
    case "day-cuoc":      return "🪢";
    case "phu-kien":      return "🛍️";
    default:              return "🏪";
  }
}
