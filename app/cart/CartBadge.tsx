"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export default function CartBadge() {
  const items = useCartStore(
    (state) => state.items
  );

  const count = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Link
      href="/cart"
      className="
        relative
        flex
        items-center
        gap-2
        hover:text-green-600
      "
    >
      <span className="text-xl">
        🛒
      </span>

      <span>Giỏ hàng</span>

      {count > 0 && (
        <span
          className="
            absolute
            -top-2
            -right-4
            bg-red-500
            text-white
            text-xs
            w-5
            h-5
            rounded-full
            flex
            items-center
            justify-center
          "
        >
          {count}
        </span>
      )}
    </Link>
  );
}