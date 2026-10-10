"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

interface Product {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  stock: number;
}

export default function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const isOutOfStock = product.stock <= 0;

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product.stock && next > product.stock) return product.stock;
      return next;
    });
  }

  function handleAddToCart() {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }

    toast.success("Đã thêm vào giỏ hàng!", {
      description: `${quantity}x ${product.name} — ${(product.price * quantity).toLocaleString("vi-VN")}₫`,
    });
  }

  function handleBuyNow() {
    if (isOutOfStock) return;

    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-5 pt-4 border-t border-slate-100">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Số lượng:
        </span>
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 transition"
            aria-label="Giảm số lượng"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-bold text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock || isOutOfStock}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 transition"
            aria-label="Tăng số lượng"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-slate-400">
          (Còn {product.stock} sản phẩm sẵn có)
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Thêm vào giỏ hàng</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Zap className="h-4 w-4" />
          <span>Mua ngay</span>
        </button>
      </div>
    </div>
  );
}

