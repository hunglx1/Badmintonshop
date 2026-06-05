"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

const STORAGE_KEY = "hungbadminton_address";

interface SavedAddress {
  customerName: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Auto-fill từ localStorage nếu đã đăng nhập
  useEffect(() => {
    if (!session?.user) return;
    const storageKey = `${STORAGE_KEY}_${session.user.email}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data: SavedAddress = JSON.parse(saved);
        setCustomerName(data.customerName || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setHasSaved(true);
      } else {
        // Prefill tên từ session
        setCustomerName(session.user.name || "");
      }
    } catch {}
  }, [session]);

  function clearSavedAddress() {
    if (!session?.user) return;
    const storageKey = `${STORAGE_KEY}_${session.user.email}`;
    localStorage.removeItem(storageKey);
    setHasSaved(false);
    setCustomerName(session.user.name || "");
    setPhone("");
    setAddress("");
  }

  async function handleOrder() {
    if (!customerName || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setLoading(true);

      // Lưu địa chỉ nếu đã đăng nhập và chọn lưu
      if (session?.user && saveAddress) {
        const storageKey = `${STORAGE_KEY}_${session.user.email}`;
        localStorage.setItem(storageKey, JSON.stringify({ customerName, phone, address }));
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, phone, address, items, totalAmount }),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      clearCart();
      setTimeout(() => router.push("/"), 2500);
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
    setLoading(false);
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Đặt hàng thành công! 🎉</h2>
          <p className="text-gray-500">Chúng tôi sẽ liên hệ xác nhận sớm nhất</p>
          <p className="text-sm text-gray-400 mt-4">Đang chuyển về trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Thanh toán</h1>
        <p className="text-gray-500 mt-1">Điền thông tin để hoàn tất đơn hàng</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">

        {/* LEFT — Form */}
        <div className="lg:col-span-3 space-y-5">

          {/* Saved address banner */}
          {session?.user && hasSaved && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Đã điền thông tin đã lưu</p>
                  <p className="text-xs text-green-600">Kiểm tra lại trước khi đặt hàng</p>
                </div>
              </div>
              <button
                onClick={clearSavedAddress}
                className="text-xs text-green-700 hover:text-green-900 underline underline-offset-2"
              >
                Dùng địa chỉ khác
              </button>
            </div>
          )}

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Thông tin nhận hàng
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 234 567"
                  type="tel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ giao hàng *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Save address toggle — chỉ hiện khi đã đăng nhập */}
              {session?.user && (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setSaveAddress(!saveAddress)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${saveAddress ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${saveAddress ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Lưu địa chỉ cho lần sau
                  </span>
                </label>
              )}

              {!session?.user && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                  💡 <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>Đăng nhập</span> để lưu địa chỉ tự động cho lần sau
                </p>
              )}
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Phương thức thanh toán
            </h2>
            <div className="flex items-center gap-3 border-2 border-green-500 bg-green-50 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                <p className="text-xs text-gray-500">Kiểm tra hàng trước khi thanh toán</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Đơn hàng của bạn</h2>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    {item.thumbnail && (
                      <Image src={item.thumbnail} alt={item.name} fill sizes="48px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-gray-200 mt-4 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Tổng thanh toán</span>
              <span className="text-2xl font-black text-red-500">
                {totalAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleOrder}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-green-200 active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đặt hàng ngay
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Thông tin được bảo mật tuyệt đối
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}