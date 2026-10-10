"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-600 active:scale-95"
      aria-label="Giỏ hàng"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5 text-slate-700 transition group-hover:text-red-600" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow-sm animate-in zoom-in-50">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
      <span className="hidden text-sm font-semibold sm:inline">Giỏ hàng</span>
    </Link>
  );
}