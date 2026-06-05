import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────
interface Props {
  searchParams: Promise<{
    search?:   string;
    category?: string;
    brand?:    string | string[];
    minPrice?: string;
    maxPrice?: string;
    page?:     string;
  }>;
}

// ─── Dữ liệu tĩnh ─────────────────────────────────────────────
const CATEGORIES = [
  { label: "Tất cả",        slug: "",              icon: "🏪" },
  { label: "Vợt cầu lông",  slug: "vot-cau-long",  icon: "🏸" },
  { label: "Giày cầu lông", slug: "giay-cau-long",  icon: "👟" },
  { label: "Túi / Balo",    slug: "tui-cau-long",   icon: "🎒" },
  { label: "Dây cước",      slug: "day-cuoc",        icon: "🪢" },
  { label: "Phụ kiện",      slug: "phu-kien",        icon: "🛍️" },
];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: "",        max: ""        },
  { label: "Dưới 500.000₫",  min: "0",       max: "500000"  },
  { label: "500k – 1 triệu", min: "500000",  max: "1000000" },
  { label: "1 – 2 triệu",    min: "1000000", max: "2000000" },
  { label: "2 – 4 triệu",    min: "2000000", max: "4000000" },
  { label: "Trên 4 triệu",   min: "4000000", max: ""        },
];

const BRANDS = ["Yonex", "Victor", "Lining", "Mizuno", "Apacs", "Kawasaki"];

const LIMIT = 12;

// ─── Helper: build href giữ nguyên params hiện tại ────────────
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

  // Reset page khi thay filter (trừ khi override page có giá trị)
  if (!("page" in overrides)) q.set("page", "1");

  return `/products?${q.toString()}`;
}

// ─── Page ─────────────────────────────────────────────────────
export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search      = params.search   || "";
  const categorySlug = params.category || "";
  const activeBrands = params.brand
    ? Array.isArray(params.brand) ? params.brand : [params.brand]
    : [];
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const page     = parseInt(params.page || "1");

  // ─── Query ──────────────────────────────────────────────────
  const where = {
    AND: [
      search       ? { name: { contains: search, mode: "insensitive" as const } } : {},
      categorySlug ? { category: { slug: categorySlug } }                          : {},
      activeBrands.length > 0 ? { brand: { in: activeBrands } }                   : {},
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

  // params hiện tại dùng cho buildHref
  const cur = {
    search:   search   || undefined,
    category: categorySlug || undefined,
    brand:    activeBrands.length > 0 ? activeBrands : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">

      {/* Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            {categorySlug
              ? CATEGORIES.find((c) => c.slug === categorySlug)?.label ?? "Sản phẩm"
              : "Tất cả sản phẩm"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{total} sản phẩm</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">

        {/* ── SIDEBAR ── */}
        <aside className="bg-white p-5 rounded-xl shadow h-fit space-y-6">

          {/* Tìm kiếm */}
          <form method="GET" action="/products">
            {/* Giữ các filter hiện tại khi search */}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            {activeBrands.map((b) => (
              <input key={b} type="hidden" name="brand" value={b} />
            ))}
            {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
            {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}

            <input
              name="search"
              defaultValue={search}
              placeholder="Tìm sản phẩm..."
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="mt-3 bg-green-600 text-white w-full py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Danh mục */}
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Danh mục</h2>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => {
                const active = categorySlug === cat.slug;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={buildHref(
                        { ...cur, category: cat.slug || undefined },
                        { category: cat.slug || null, page: "1" }
                      )}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-green-600 text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Thương hiệu */}
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Thương hiệu</h2>
            <ul className="space-y-2">
              {BRANDS.map((brand) => {
                const checked = activeBrands.includes(brand);
                const nextBrands = checked
                  ? activeBrands.filter((b) => b !== brand)
                  : [...activeBrands, brand];
                return (
                  <li key={brand}>
                    <Link
                      href={buildHref(cur, { brand: nextBrands.length ? nextBrands : null })}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 group"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          checked
                            ? "border-green-600 bg-green-600"
                            : "border-gray-300 group-hover:border-green-400"
                        }`}
                      >
                        {checked && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {brand}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Khoảng giá */}
          <div>
            <h2 className="font-bold text-gray-800 mb-3">Khoảng giá</h2>
            <ul className="space-y-1">
              {PRICE_RANGES.map((r) => {
                const active = minPrice === r.min && maxPrice === r.max;
                return (
                  <li key={r.label}>
                    <Link
                      href={buildHref(cur, {
                        minPrice: r.min || null,
                        maxPrice: r.max || null,
                        page: "1",
                      })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0" />
                      )}
                      {r.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Reset filter */}
          {(categorySlug || activeBrands.length > 0 || minPrice || maxPrice || search) && (
            <Link
              href="/products"
              className="block text-center text-sm text-red-500 hover:underline"
            >
              ✕ Xoá tất cả bộ lọc
            </Link>
          )}
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div className="md:col-span-3">

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-24">
              <span className="text-5xl">🏸</span>
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Không tìm thấy sản phẩm
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition group"
                  >
                    <div className="relative h-60 bg-gray-50">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      {/* Category badge */}
                      {"category" in product && product.category && (
                        <span className="inline-block mb-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {(product.category as { name: string }).name}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">{product.brand}</p>
                      <p className="text-green-600 font-bold text-xl mt-2">
                        {product.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={buildHref(cur, { page: String(page - 1) })}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      ← Trước
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, i, arr) => (
                      <Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-1 text-gray-400">…</span>
                        )}
                        <Link
                          href={buildHref(cur, { page: String(p) })}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-green-600 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </Link>
                      </Fragment>
                    ))}

                  {page < totalPages && (
                    <Link
                      href={buildHref(cur, { page: String(page + 1) })}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Tiếp →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
