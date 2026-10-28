import Link from "next/link";
import {
  ChevronRight,
  Filter,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Home,
  Tag,
  X,
  PackageX,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import ProductFilterControls from "@/components/products/ProductFilterControls";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

const CATEGORIES = [
  { label: "Tất cả sản phẩm", slug: "", icon: "🏪" },
  { label: "Vợt cầu lông", slug: "vot-cau-long", icon: "🏸" },
  { label: "Giày cầu lông", slug: "giay-cau-long", icon: "👟" },
  { label: "Túi & Balo", slug: "tui-cau-long", icon: "🎒" },
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
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1", 10) || 1;

  // Build Prisma where filter
  const where = {
    AND: [
      search ? { name: { contains: search, mode: "insensitive" as const } } : {},
      categorySlug ? { category: { slug: categorySlug } } : {},
      activeBrands.length > 0 ? { brand: { in: activeBrands } } : {},
      minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseInt(minPrice, 10) } : {}),
              ...(maxPrice ? { lte: parseInt(maxPrice, 10) } : {}),
            },
          }
        : {},
    ],
  };

  // Determine sorting order
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  const [products, total, currentCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        reviews: true,
      },
      orderBy,
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
    prisma.product.count({ where }),
    categorySlug
      ? prisma.category.findUnique({ where: { slug: categorySlug } })
      : null,
  ]);

  const totalPages = Math.ceil(total / LIMIT) || 1;
  const cur = {
    search: search || undefined,
    category: categorySlug || undefined,
    brand: activeBrands.length > 0 ? activeBrands : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sort: sort !== "newest" ? sort : undefined,
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(categorySlug) ||
    activeBrands.length > 0 ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  const pageTitle = currentCategory
    ? currentCategory.name
    : search
    ? `Kết quả tìm kiếm cho "${search}"`
    : "Tất cả sản phẩm cầu lông";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* 1. BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-red-600 transition flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/products" className="hover:text-red-600 transition">
              Sản phẩm
            </Link>
            {currentCategory && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-slate-900 font-bold">{currentCategory.name}</span>
              </>
            )}
            {search && !currentCategory && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-slate-900 font-bold">"{search}"</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. CATEGORY BANNER HEADER */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                <Tag className="h-3.5 w-3.5 text-red-600" />
                <span>Kho trang bị thể thao chính hãng</span>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {pageTitle}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Khám phá tuyển tập vợt, giày và phụ kiện thi đấu tiêu chuẩn. Sử dụng bộ lọc thông minh để tìm đúng thông số phù hợp với lối chơi.
              </p>
            </div>
            <div className="shrink-0 self-start sm:self-center rounded-2xl bg-slate-100 border border-slate-200 px-5 py-3 text-center">
              <span className="block text-2xl font-black text-slate-900">{total}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sản phẩm</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT: SIDEBAR + PRODUCT GRID */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* ────────────────── FILTER SIDEBAR ────────────────── */}
          <aside id="product-filter-sidebar" className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-red-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Bộ lọc sản phẩm
                  </h2>
                </div>
                {hasActiveFilters && (
                  <Link
                    href="/products"
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Xóa lọc
                  </Link>
                )}
              </div>

              {/* Search in sidebar */}
              <form method="GET" action="/products" className="space-y-2 mb-6">
                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                {activeBrands.map((b) => (
                  <input key={b} type="hidden" name="brand" value={b} />
                ))}
                {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
                {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
                {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tìm từ khóa
                </label>
                <div className="relative">
                  <input
                    name="search"
                    defaultValue={search}
                    placeholder="Tên vợt, mã giày..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-red-600 focus:bg-white"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Danh mục
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const active = categorySlug === cat.slug;
                    return (
                      <Link
                        key={cat.slug}
                        href={buildHref(
                          { ...cur, category: cat.slug || undefined },
                          { category: cat.slug || null, page: "1" }
                        )}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-red-50 text-red-600 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Thương hiệu
                </h3>
                <div className="space-y-1.5">
                  {BRANDS.map((brand) => {
                    const checked = activeBrands.includes(brand);
                    const nextBrands = checked
                      ? activeBrands.filter((b) => b !== brand)
                      : [...activeBrands, brand];
                    return (
                      <Link
                        key={brand}
                        href={buildHref(cur, {
                          brand: nextBrands.length ? nextBrands : null,
                          page: "1",
                        })}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition ${
                          checked
                            ? "font-bold text-red-600"
                            : "text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                            checked
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && <span className="text-[10px]">✓</span>}
                        </div>
                        <span>{brand}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="pt-5 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Khoảng giá
                </h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((r) => {
                    const active = minPrice === r.min && maxPrice === r.max;
                    return (
                      <Link
                        key={r.label}
                        href={buildHref(cur, {
                          minPrice: r.min || null,
                          maxPrice: r.max || null,
                          page: "1",
                        })}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                          active
                            ? "bg-red-50 text-red-600 font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{r.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Clear button if active */}
              {hasActiveFilters && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <Link
                    href="/products"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:border-red-200 hover:text-red-600 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Xóa tất cả bộ lọc
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* ────────────────── PRODUCT SECTION ────────────────── */}
          <section className="space-y-6">
            {/* Filter controls bar: Count + Sorting dropdown + Mobile filter button */}
            <ProductFilterControls total={total} currentSort={sort} />

            {/* Active filter badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Đang lọc theo:</span>
                {categorySlug && (
                  <Link
                    href={buildHref(cur, { category: null })}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 font-semibold text-slate-800 hover:bg-red-100 hover:text-red-700 transition"
                  >
                    <span>{CATEGORIES.find((c) => c.slug === categorySlug)?.label}</span>
                    <X className="h-3 w-3" />
                  </Link>
                )}
                {activeBrands.map((b) => (
                  <Link
                    key={b}
                    href={buildHref(cur, {
                      brand: activeBrands.filter((item) => item !== b),
                    })}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 font-semibold text-slate-800 hover:bg-red-100 hover:text-red-700 transition"
                  >
                    <span>{b}</span>
                    <X className="h-3 w-3" />
                  </Link>
                ))}
                {(minPrice || maxPrice) && (
                  <Link
                    href={buildHref(cur, { minPrice: null, maxPrice: null })}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 font-semibold text-slate-800 hover:bg-red-100 hover:text-red-700 transition"
                  >
                    <span>
                      {PRICE_RANGES.find((r) => r.min === minPrice && r.max === maxPrice)?.label ||
                        "Khoảng giá"}
                    </span>
                    <X className="h-3 w-3" />
                  </Link>
                )}
                {search && (
                  <Link
                    href={buildHref(cur, { search: null })}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 font-semibold text-slate-800 hover:bg-red-100 hover:text-red-700 transition"
                  >
                    <span>"{search}"</span>
                    <X className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    thumbnail={product.thumbnail}
                    price={Number(product.price)}
                    brand={product.brand}
                    stock={product.stock}
                    category={product.category}
                    reviews={product.reviews}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <PackageX className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Hãy thử điều chỉnh bộ lọc, thương hiệu hoặc tìm kiếm với từ khóa khác.
                </p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-red-700 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Xem tất cả sản phẩm</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {page > 1 ? (
                  <Link
                    href={buildHref(cur, { page: String(page - 1) })}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-red-300 hover:text-red-600"
                  >
                    ← Trước
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed">
                    ← Trước
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isCur = p === page;
                    return (
                      <Link
                        key={p}
                        href={buildHref(cur, { page: String(p) })}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
                          isCur
                            ? "bg-red-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-red-600"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {page < totalPages ? (
                  <Link
                    href={buildHref(cur, { page: String(page + 1) })}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-red-300 hover:text-red-600"
                  >
                    Sau →
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed">
                    Sau →
                  </span>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
