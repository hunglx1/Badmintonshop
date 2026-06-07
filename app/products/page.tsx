import { Fragment } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

const CATEGORIES = [
  { label: "Tất cả", slug: "", icon: "🏪" },
  { label: "Vợt cầu lông", slug: "vot-cau-long", icon: "🏸" },
  { label: "Giày cầu lông", slug: "giay-cau-long", icon: "👟" },
  { label: "Túi / Balo", slug: "tui-cau-long", icon: "🎒" },
  { label: "Dây cước", slug: "day-cuoc", icon: "🪢" },
  { label: "Phụ kiện", slug: "phu-kien", icon: "🛍️" },
];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: "", max: "" },
  { label: "Dưới 500.000₫", min: "0", max: "500000" },
  { label: "500k – 1 triệu", min: "500000", max: "1000000" },
  { label: "1 – 2 triệu", min: "1000000", max: "2000000" },
  { label: "2 – 4 triệu", min: "2000000", max: "4000000" },
  { label: "Trên 4 triệu", min: "4000000", max: "" },
];

const BRANDS = ["Yonex", "Victor", "Lining", "Mizuno", "Apacs", "Kawasaki"];
const LIMIT = 12;

function buildHref(
  current: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | string[] | null>
) {
  const q = new URLSearchParams();
  const merged = { ...current, ...overrides };

  Object.entries(merged).forEach(([k, v]) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach((i) => q.append(k, i));
    else q.set(k, v);
  });

  if (!("page" in overrides)) q.set("page", "1");
  return `/products?${q.toString()}`;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const categorySlug = params.category || "";
  const activeBrands = params.brand
    ? Array.isArray(params.brand)
      ? params.brand
      : [params.brand]
    : [];
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const page = parseInt(params.page || "1");

  const where = {
    AND: [
      search ? { name: { contains: search, mode: "insensitive" as const } } : {},
      categorySlug ? { category: { slug: categorySlug } } : {},
      activeBrands.length > 0 ? { brand: { in: activeBrands } } : {},
      minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseInt(minPrice) } : {}),
              ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
            },
          }
        : {},
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);
  const cur = {
    search: search || undefined,
    category: categorySlug || undefined,
    brand: activeBrands.length > 0 ? activeBrands : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Danh sách sản phẩm</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Tìm chiếc vợt hoàn hảo cho mọi cú đánh</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Lọc theo thương hiệu, danh mục và thông số để chọn cây vợt chuyên nghiệp, chuẩn tốc độ và phản hồi.</p>
            </div>
            <div className="rounded-full border border-[#CCFF00]/20 bg-white/5 px-6 py-3 text-sm font-semibold text-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.2)]">{total} sản phẩm</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-6 rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.7)]">
            <form method="GET" action="/products" className="space-y-5">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {activeBrands.map((b) => (
                <input key={b} type="hidden" name="brand" value={b} />
              ))}
              {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
              {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}

              <label className="block text-sm font-medium text-slate-300">Tìm kiếm</label>
              <input
                name="search"
                defaultValue={search}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-200 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
              />
              <button className="w-full rounded-2xl bg-[#CCFF00] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#dcff00]/90">Tìm kiếm</button>
            </form>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">Danh mục</h2>
                <div className="mt-4 space-y-2">
                  {CATEGORIES.map((cat) => {
                    const active = categorySlug === cat.slug;
                    return (
                      <Link
                        key={cat.slug}
                        href={buildHref({ ...cur, category: cat.slug || undefined }, { category: cat.slug || null, page: "1" })}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                          active
                            ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">Thương hiệu</h2>
                <div className="mt-4 space-y-2">
                  {BRANDS.map((brand) => {
                    const checked = activeBrands.includes(brand);
                    const nextBrands = checked ? activeBrands.filter((b) => b !== brand) : [...activeBrands, brand];
                    return (
                      <Link
                        key={brand}
                        href={buildHref(cur, { brand: nextBrands.length ? nextBrands : null })}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-[#CCFF00] bg-[#CCFF00]" : "border-slate-700"}`}>
                          {checked && <span className="h-2 w-2 rounded-full bg-slate-950" />}
                        </span>
                        {brand}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">Khoảng giá</h2>
                <div className="mt-4 space-y-2">
                  {PRICE_RANGES.map((r) => {
                    const active = minPrice === r.min && maxPrice === r.max;
                    return (
                      <Link
                        key={r.label}
                        href={buildHref(cur, { minPrice: r.min || null, maxPrice: r.max || null, page: "1" })}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
                          active ? "bg-[#CCFF00]/10 text-[#CCFF00]" : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" />}
                        {r.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {(categorySlug || activeBrands.length > 0 || minPrice || maxPrice || search) && (
                <Link href="/products" className="block text-center text-sm text-[#CCFF00] hover:text-white">
                  ✕ Xoá tất cả bộ lọc
                </Link>
              )}
            </div>
          </aside>

          <section className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Tổng sản phẩm</p>
                <p className="mt-3 text-3xl font-black text-white">{total}</p>
              </div>
              <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Trang hiện tại</p>
                <p className="mt-3 text-3xl font-black text-white">{page}</p>
              </div>
              <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Dòng CEO</p>
                <p className="mt-3 text-3xl font-black text-[#CCFF00]">Elite</p>
              </div>
              <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Chất lượng</p>
                <p className="mt-3 text-3xl font-black text-white">Pro</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-slate-700 bg-[#121824] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/60"
                >
                  <div className="relative h-72 overflow-hidden bg-slate-950">
                    <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 rounded-b-[2rem] bg-gradient-to-t from-[#0B0F19]/95 to-transparent p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#CCFF00]">{product.brand}</p>
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-2xl font-black text-[#CCFF00]">{Math.round(product.price).toLocaleString()}₫</span>
                      <span className="rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-300">Chi tiết</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-slate-700 bg-[#121824]/80 px-6 py-8 text-center text-slate-300">
              <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Nâng cấp trải nghiệm</p>
              <h2 className="text-3xl font-extrabold text-white">Mua vợt chuyên nghiệp với thiết kế tối ưu và giá cạnh tranh</h2>
              <Link href="/checkout" className="inline-flex rounded-full bg-[#CCFF00] px-8 py-3 font-semibold text-slate-950 transition hover:bg-[#daff00]/90">Thanh toán nhanh</Link>
            </div>

            <div className="flex items-center justify-between rounded-[2rem] border border-slate-700 bg-[#121824]/80 px-6 py-5 text-sm text-slate-400">
              <span>Trang {page} / {totalPages}</span>
              <span>{activeBrands.length} thương hiệu</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
