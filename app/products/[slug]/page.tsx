import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Zap,
  Tag,
  CheckCircle2,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import ProductAIModal from "@/components/ai/ProductAIModal";
import ProductReviews from "@/components/products/ProductReviews";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: true,
      category: true,
      specifications: true,
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: {
      category: true,
      reviews: true,
    },
    take: 4,
  });

  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* 1. BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-red-600 transition flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link href="/products" className="hover:text-red-600 transition">
              Sản phẩm
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-red-600 transition"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2. MAIN PRODUCT OVERVIEW */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
          {/* Left Column: Image Gallery Box */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              {/* Badges */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                <span className="rounded-lg border border-slate-200 bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  {product.brand}
                </span>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="bg-amber-500 text-white border-0">
                    Chỉ còn {product.stock}
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="secondary" className="bg-slate-700 text-white">
                    Tạm hết hàng
                  </Badge>
                )}
              </div>

              {/* Main Image */}
              <div className="relative h-80 sm:h-[480px] w-full overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6 transition-transform duration-500 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="text-6xl">🏸</span>
                    <span className="text-sm font-semibold mt-2">{product.brand}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Advisor Modal Trigger */}
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-2xs">
              <ProductAIModal productId={product.id} productName={product.name} />
            </div>
          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>{product.brand}</span>
                <span>•</span>
                <span className="text-red-600">{product.category.name}</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating snippet */}
              <div className="mt-3 flex items-center gap-3">
                {avgRating ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="font-bold text-slate-900">{avgRating}</span>
                    <span className="text-slate-400">({product.reviews.length} đánh giá)</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Chưa có đánh giá</span>
                )}
                <span className="text-slate-200">|</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {product.stock > 0 ? "Còn hàng sẵn kho" : "Liên hệ đặt trước"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Giá bán niêm yết
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-red-600">
                  {Number(product.price).toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  (Đã bao gồm VAT)
                </span>
              </div>
            </div>

            {/* Action Buttons & Quantity */}
            <ProductDetailActions product={{ ...product, price: Number(product.price) }} />

            {/* Services & Guarantees */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-3.5 text-xs text-slate-600">
              <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                Cam kết dịch vụ tại Hưng Badminton:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Freeship đơn từ 1.000.000₫</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-red-600 shrink-0" />
                  <span>100% Chuẩn thi đấu</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Đổi trả / đổi size 7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 shrink-0" />
                  <span>Căng cước máy điện tử 4 nút</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PRODUCT DESCRIPTION & SPECIFICATIONS */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Description */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Mô tả chi tiết sản phẩm
            </h2>
            <div className="text-sm leading-relaxed text-slate-600 space-y-3 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                Thông số kỹ thuật
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr
                        key={spec.id}
                        className={`border-b border-slate-100 last:border-b-0 ${
                          idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                        }`}
                      >
                        <td className="w-2/5 px-4 py-3 font-semibold text-slate-900">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 4. CUSTOMER REVIEWS */}
        <ProductReviews productId={product.id} reviews={product.reviews} />

        {/* 5. RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Gợi ý thêm
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Sản Phẩm Cùng Danh Mục
                </h2>
              </div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
              >
                Xem thêm
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  thumbnail={item.thumbnail}
                  price={Number(item.price)}
                  brand={item.brand}
                  stock={item.stock}
                  category={item.category}
                  reviews={item.reviews}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
