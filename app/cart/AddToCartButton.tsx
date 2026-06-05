"use client";

import { useCartStore } from "@/store/cart-store";

export default function AddToCartButton({
  product,
}: any) {
  const addItem =
    useCartStore(
      (state) => state.addItem
    );

  return (
    <button
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail:
            product.thumbnail,
          quantity: 1,
        })
      }
      className="
        bg-green-600
        text-white
        px-6
        py-3
        rounded-lg
      "
    >
      Thêm vào giỏ hàng
    </button>
  );
}