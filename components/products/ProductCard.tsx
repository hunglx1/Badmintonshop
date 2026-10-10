"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id?: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  brand?: string;
  stock?: number;
  category?: { name: string; slug?: string } | string;
  reviews?: Array<{ rating: number; id?: string }>;
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  thumbnail,
  price,
  brand,
  stock,
  category,
  reviews,
  badge,
}: ProductCardProps) {
  const [hasError, setHasError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const categoryName =
    typeof category === "object" && category !== null
      ? category.name
      : typeof category === "string"
      ? category
      : null;

  const avgRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: id || slug,
      name,
      price,
      thumbnail,
      quantity: 1,
    });

    toast.success("Đã thêm vào giỏ hàng!", {
      description: `${name} — ${price.toLocaleString("vi-VN")}₫`,
    });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {badge && (
          <Badge variant="default" className="bg-red-600 text-white font-semibold shadow-sm">
            {badge}
          </Badge>
        )}
        {stock !== undefined && stock <= 5 && stock > 0 && (
          <Badge variant="destructive" className="bg-amber-500 text-white border-0 shadow-sm">
            Chỉ còn {stock}
          </Badge>
        )}
        {stock === 0 && (
          <Badge variant="secondary" className="bg-slate-800 text-white shadow-sm">
            Tạm hết hàng
          </Badge>
        )}
      </div>

      {/* Brand badge top right */}
      {brand && (
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
            {brand}
          </span>
        </div>
      )}

      {/* Thumbnail */}
      <Link href={`/products/${slug}`} className="relative block h-64 w-full overflow-hidden bg-slate-50">
        {!hasError && thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-4 text-center">
            <span className="text-4xl">🏸</span>
            <span className="mt-2 text-xs font-medium text-slate-400">{brand || "Hưng Badminton"}</span>
          </div>
        )}

        {/* Quick action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/10 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-red-600 hover:text-white">
            <Eye className="h-3.5 w-3.5" />
            Xem chi tiết
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {categoryName && (
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 line-clamp-1">
            {categoryName}
          </p>
        )}

        <Link
          href={`/products/${slug}`}
          className="mt-1 font-semibold text-slate-900 line-clamp-2 transition-colors hover:text-red-600 text-sm sm:text-base leading-snug"
          title={name}
        >
          {name}
        </Link>

        {/* Reviews snippet */}
        {avgRating && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-semibold text-slate-700">{avgRating}</span>
            <span>({reviews?.length || 0})</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Giá niêm yết</span>
            <span className="text-base sm:text-lg font-bold text-red-600">
              {price.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            type="button"
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md active:scale-95"
            title="Thêm vào giỏ hàng"
            aria-label={`Thêm ${name} vào giỏ hàng`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}