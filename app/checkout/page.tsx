"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

const STORAGE_KEY = "hungbadminton_address";

const LOCATION_OPTIONS = [
  {
    province: "Hà Nội",
    districts: [
      { name: "Ba Đình", wards: ["Phúc Xá", "Trúc Bạch", "Ngọc Hà"] },
      { name: "Hoàn Kiếm", wards: ["Hàng Bài", "Phúc Tân", "Hàng Gai"] },
      { name: "Cầu Giấy", wards: ["Dịch Vọng", "Nghĩa Đô", "Yên Hòa"] },
    ],
  },
  {
    province: "Hồ Chí Minh",
    districts: [
      { name: "Quận 1", wards: ["Bến Nghé", "Cô Giang", "Nguyễn Thái Bình"] },
      { name: "Quận 3", wards: ["Phường 1", "Phường 2", "Phường 4"] },
      { name: "Quận 10", wards: ["Phường 13", "Phường 14", "Phường 15"] },
    ],
  },
  {
    province: "Đà Nẵng",
    districts: [
      { name: "Hải Châu", wards: ["Thạch Thang", "Hòa Cường Bắc", "Hòa Cường Nam"] },
      { name: "Sơn Trà", wards: ["An Hải Bắc", "An Hải Đông", "An Hải Tây"] },
    ],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState(LOCATION_OPTIONS[0].province);
  const [district, setDistrict] = useState(LOCATION_OPTIONS[0].districts[0].name);
  const [ward, setWard] = useState(LOCATION_OPTIONS[0].districts[0].wards[0]);
  const [saveAddress, setSaveAddress] = useState(true);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!session?.user) return;
    const storageKey = `${STORAGE_KEY}_${session.user.email}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setCustomerName(data.customerName || "");
        setPhone(data.phone || "");
        setStreet(data.street || "");
        setProvince(data.province || LOCATION_OPTIONS[0].province);
        setDistrict(data.district || LOCATION_OPTIONS[0].districts[0].name);
        setWard(data.ward || LOCATION_OPTIONS[0].districts[0].wards[0]);
        setHasSaved(true);
        setUseSavedAddress(true);
      } else {
        setCustomerName(session.user.name || "");
        setUseSavedAddress(false);
      }
    } catch {
      setUseSavedAddress(false);
    }
  }, [session]);

  function clearSavedAddress() {
    if (!session?.user) return;
    const storageKey = `${STORAGE_KEY}_${session.user.email}`;
    localStorage.removeItem(storageKey);
    setHasSaved(false);
    setUseSavedAddress(false);
    setCustomerName(session.user.name || "");
    setPhone("");
    setStreet("");
    setProvince(LOCATION_OPTIONS[0].province);
    setDistrict(LOCATION_OPTIONS[0].districts[0].name);
    setWard(LOCATION_OPTIONS[0].districts[0].wards[0]);
  }

  const fullAddress = [street, ward, district, province].filter(Boolean).join(", ");

  async function handleOrder() {
    if (!customerName || !phone || !street || !ward || !district || !province) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }
    try {
      setLoading(true);
      if (session?.user && saveAddress) {
        const storageKey = `${STORAGE_KEY}_${session.user.email}`;
        localStorage.setItem(
          storageKey,
          JSON.stringify({ customerName, phone, street, ward, district, province })
        );
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, phone, address: fullAddress, items, totalAmount }),
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

  if (success) {
    return (
      <div className="min-h-[70vh] bg-[#0B0F19] px-4 py-16 text-white">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-[2rem] border border-[#CCFF00]/30 bg-[#121824]/90 p-10 text-center shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#CCFF00]/15 text-[#CCFF00] text-4xl">✓</div>
          <h2 className="text-3xl font-black">Đặt hàng thành công! 🎉</h2>
          <p className="text-slate-300">Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>
          <p className="text-sm text-slate-500">Đang chuyển về trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Thanh toán</p>
          <h1 className="mt-3 text-4xl font-extrabold text-white">Hoàn tất đơn hàng của bạn</h1>
          <p className="mt-2 text-slate-400">Điền thông tin nhận hàng và xác nhận đơn.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            {session?.user && hasSaved && (
              <div className="rounded-[2rem] border border-[#CCFF00]/25 bg-[#CCFF00]/10 p-5 text-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#E5F55B]">Địa chỉ đã lưu</p>
                    <p className="mt-2 text-base font-semibold text-white">Chọn địa chỉ hiện tại để giao hàng nhanh</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="inline-flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-700 bg-[#0B1220]/80 px-4 py-3 text-sm text-white transition hover:border-[#CCFF00]">
                      <input
                        type="radio"
                        checked={useSavedAddress}
                        onChange={() => setUseSavedAddress(true)}
                        className="h-4 w-4 accent-[#CCFF00]"
                      />
                      Dùng địa chỉ đã lưu
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-700 bg-[#0B1220]/80 px-4 py-3 text-sm text-white transition hover:border-[#CCFF00]">
                      <input
                        type="radio"
                        checked={!useSavedAddress}
                        onChange={() => setUseSavedAddress(false)}
                        className="h-4 w-4 accent-[#CCFF00]"
                      />
                      Nhập địa chỉ mới
                    </label>
                  </div>
                </div>
                {useSavedAddress && (
                  <div className="mt-5 rounded-3xl border border-slate-700 bg-[#0B1220]/90 p-5 text-slate-200">
                    <p className="text-sm text-slate-400">Địa chỉ hiện tại</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white">{fullAddress || "Chưa có địa chỉ lưu. Vui lòng cập nhật."}</p>
                    <button
                      type="button"
                      onClick={() => setUseSavedAddress(false)}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-4 py-2 text-sm text-[#CCFF00] transition hover:bg-[#CCFF00]/15"
                    >
                      Chỉnh sửa địa chỉ
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#CCFF00]/10 text-[#CCFF00] text-xl">📍</div>
                <div>
                  <h2 className="text-xl font-bold text-white">Thông tin nhận hàng</h2>
                  <p className="text-sm text-slate-400">Vui lòng điền đầy đủ để giao nhanh.</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Họ và tên *</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Số điện thoại *</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901 234 567"
                    type="tel"
                    className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Địa chỉ giao hàng *</label>
                  {session?.user && hasSaved && useSavedAddress ? (
                    <div className="rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-4 text-slate-200">
                      <p className="text-sm text-slate-400">Địa chỉ sẽ được dùng cho đơn hàng này</p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white">{fullAddress}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block text-sm text-slate-300">
                          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Tỉnh/Thành</span>
                          <select
                            value={province}
                            onChange={(e) => {
                              const selected = LOCATION_OPTIONS.find((item) => item.province === e.target.value);
                              setProvince(e.target.value);
                              setDistrict(selected?.districts[0].name || "");
                              setWard(selected?.districts[0].wards[0] || "");
                            }}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                          >
                            {LOCATION_OPTIONS.map((option) => (
                              <option key={option.province} value={option.province} className="bg-[#0B0F19] text-white">
                                {option.province}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-sm text-slate-300">
                          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Quận/Huyện</span>
                          <select
                            value={district}
                            onChange={(e) => {
                              const selected = LOCATION_OPTIONS.find((item) => item.province === province);
                              setDistrict(e.target.value);
                              const foundDistrict = selected?.districts.find((d) => d.name === e.target.value);
                              setWard(foundDistrict?.wards[0] || "");
                            }}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                          >
                            {(LOCATION_OPTIONS.find((item) => item.province === province)?.districts || []).map((option) => (
                              <option key={option.name} value={option.name} className="bg-[#0B0F19] text-white">
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-sm text-slate-300">
                          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phường/Xã</span>
                          <select
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                          >
                            {(
                              LOCATION_OPTIONS.find((item) => item.province === province)
                                ?.districts.find((d) => d.name === district)
                                ?.wards || []
                            ).map((option) => (
                              <option key={option} value={option} className="bg-[#0B0F19] text-white">
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Số nhà/Tên đường *</label>
                        <input
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Ví dụ: 123 Lý Thường Kiệt"
                          className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {session?.user && (
                  <label className="flex items-center gap-3 text-sm text-slate-300">
                    <div
                      onClick={() => setSaveAddress(!saveAddress)}
                      className={`relative h-6 w-11 rounded-full transition ${saveAddress ? "bg-[#CCFF00]" : "bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${saveAddress ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                    Lưu địa chỉ cho lần sau
                  </label>
                )}
                {!session?.user && (
                  <div className="rounded-2xl border border-slate-700 bg-white/5 px-4 py-3 text-sm text-slate-400">
                    <p>
                      <span className="text-[#CCFF00]">Đăng nhập</span> để lưu địa chỉ tự động cho lần sau.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#CCFF00]/10 text-[#CCFF00] text-xl">💳</div>
                <div>
                  <h2 className="text-xl font-bold text-white">Phương thức thanh toán</h2>
                  <p className="text-sm text-slate-400">Thanh toán khi nhận hàng (COD).</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-[#0B0F19]/80 px-5 py-4">
                <p className="text-sm font-semibold text-white">Thanh toán khi nhận hàng</p>
                <p className="mt-1 text-sm text-slate-500">Kiểm tra hàng trước khi thanh toán.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
              <h2 className="text-xl font-bold text-white">Đơn hàng</h2>
              <div className="mt-5 space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-[#0B0F19]/70 p-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                      {item.thumbnail && <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#CCFF00]">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 rounded-[1.75rem] border border-slate-700 bg-[#0B0F19]/70 p-5 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-[#CCFF00]">Miễn phí</span>
                </div>
                <div className="border-t border-slate-700 pt-4 flex items-center justify-between text-lg font-black text-white">
                  <span>Tổng thanh toán</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full rounded-full bg-[#CCFF00] px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90 disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
              >
                {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
              </button>
              <p className="mt-4 text-center text-xs text-slate-500">🔒 Thông tin được bảo mật tuyệt đối</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
