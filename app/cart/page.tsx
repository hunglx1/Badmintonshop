"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h1>
          <p className="text-gray-500 mb-8">Hãy thêm sản phẩm yêu thích vào giỏ nhé!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-green-200 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-500 mt-1">{itemCount} sản phẩm</p>
        </div>
        <Link href="/products" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
          ← Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">

        {/* LEFT — Cart Items */}
        <div className="lg:col-span-3 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                {item.thumbnail && (
                  <Image src={item.thumbnail} alt={item.name} fill sizes="96px" className="object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{item.name}</h2>
                <p className="text-green-600 font-bold mt-1">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => decrease(item.id)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increase(item.id)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">
                    = {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                title="Xóa"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT — Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Tóm tắt đơn hàng</h2>

            {/* Items list */}
            <div className="space-y-2.5 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="font-medium shrink-0">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tạm tính</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí 🎉</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Tổng cộng</span>
              <span className="text-2xl font-black text-red-500">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-green-200 active:scale-[0.98]"
            >
              Thanh toán ngay
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Thanh toán an toàn & bảo mật
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}