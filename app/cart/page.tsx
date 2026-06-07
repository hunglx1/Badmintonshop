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
      <div className="min-h-[70vh] bg-[#0B0F19] px-4 py-16 text-white">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-10 text-center shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-4xl">🛒</div>
          <div>
            <h1 className="text-3xl font-black">Giỏ hàng trống</h1>
            <p className="mt-3 text-slate-400">Thêm một cây vợt để bắt đầu hành trình nâng cấp trận đấu của bạn.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black">Giỏ hàng</h1>
            <p className="mt-2 text-slate-400">{itemCount} sản phẩm - Tổng giá trị {(total).toLocaleString("vi-VN")}₫</p>
          </div>
          <Link href="/products" className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CCFF00] transition hover:text-white">
            ← Tiếp tục mua sắm
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_25px_80px_-60px_rgba(0,0,0,0.8)] sm:flex-row sm:items-center">
                <div className="relative h-28 w-full overflow-hidden rounded-[1.5rem] border border-slate-700 bg-slate-950 sm:w-28">
                  {item.thumbnail && <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">{item.quantity} x {item.price.toLocaleString("vi-VN")}₫</p>
                  <p className="mt-2 text-sm text-slate-500">Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => decrease(item.id)}
                    className="h-11 w-11 rounded-2xl border border-slate-700 bg-white/5 text-lg text-white transition hover:bg-[#CCFF00]/10"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-white">{item.quantity}</span>
                  <button
                    onClick={() => increase(item.id)}
                    className="h-11 w-11 rounded-2xl border border-slate-700 bg-white/5 text-lg text-white transition hover:bg-[#CCFF00]/10"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="h-11 w-11 rounded-2xl border border-red-500 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                    title="Xóa"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Tóm tắt đơn hàng</h2>
                <p className="mt-2 text-slate-400">Kiểm tra trước khi tiếp tục thanh toán.</p>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm text-slate-300">
                    <span className="truncate">{item.name} x{item.quantity}</span>
                    <span className="font-semibold text-white">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.5rem] border border-slate-700 bg-[#0B0F19]/80 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-[#CCFF00]">Miễn phí</span>
                </div>
                <div className="mt-4 border-t border-slate-700 pt-4 flex items-center justify-between text-lg font-black text-white">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#CCFF00] px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90"
              >
                Thanh toán ngay
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
