"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Minus,
  Plus,
  Home,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

const FREESHIP_THRESHOLD = 1000000;
const SHIPPING_FEE = 30000;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeship = total >= FREESHIP_THRESHOLD;
  const shippingCost = total > 0 ? (isFreeship ? 0 : SHIPPING_FEE) : 0;
  const finalTotal = total + shippingCost;
  const progressPercent = Math.min(100, Math.round((total / FREESHIP_THRESHOLD) * 100));

  function handleRemove(id: string, name: string) {
    removeItem(id);
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng", {
      description: name,
    });
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-16 flex items-center justify-center">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-600">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Giỏ hàng của bạn đang trống</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
              Chưa có sản phẩm nào được chọn. Hãy khám phá các mẫu vợt, giày và phụ kiện thi đấu đỉnh cao tại Hưng Badminton!
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-red-700 active:scale-95"
          >
            <span>Khám phá sản phẩm ngay</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="text-slate-900 font-bold">Giỏ hàng</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Giỏ Hàng Của Bạn
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Có <strong className="text-slate-900">{itemCount}</strong> sản phẩm trong giỏ hàng.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
          >
            ← Tiếp tục mua sắm
          </Link>
        </div>

        {/* Freeship Progress Bar */}
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/70 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span className="flex items-center gap-1.5 text-red-700">
              <Truck className="h-4 w-4 text-red-600" />
              {isFreeship
                ? "🎉 Chúc mừng! Đơn hàng của bạn đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN toàn quốc"
                : `Mua thêm ${(FREESHIP_THRESHOLD - total).toLocaleString("vi-VN")}₫ để được MIỄN PHÍ VẬN CHUYỂN`}
            </span>
            <span className="text-slate-500">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-red-100">
            <div
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2. CART CONTENT GRID */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] items-start">
          {/* Left Column: Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
              >
                {/* Thumbnail & Name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">
                        🏸
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Đơn giá: {item.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity adjustment */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => decrease(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition"
                      aria-label="Giảm"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[2rem] text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increase(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition"
                      aria-label="Tăng"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <span className="text-sm sm:text-base font-black text-red-600 block">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-bold text-slate-900">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-slate-900">
                  {isFreeship ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    `${SHIPPING_FEE.toLocaleString("vi-VN")}₫`
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Tổng thanh toán</span>
                  <span className="text-[11px] text-slate-400">(Đã bao gồm VAT)</span>
                </div>
                <span className="text-2xl font-black text-red-600">
                  {finalTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-98"
            >
              <span>Tiến hành thanh toán</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Bảo mật thanh toán 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-red-600 shrink-0" />
                <span>Đổi trả trong vòng 7 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-red-600 shrink-0" />
                <span>Đóng gói chống sốc chuyên dụng</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
