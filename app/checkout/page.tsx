"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  CreditCard,
  Building2,
  Banknote,
  ShoppingBag,
  MapPin,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

const STORAGE_KEY = "hungbadminton_address";
const FREESHIP_THRESHOLD = 1000000;
const SHIPPING_FEE = 30000;

const LOCATION_OPTIONS = [
  {
    province: "Hà Nội",
    districts: [
      { name: "Cầu Giấy", wards: ["Dịch Vọng", "Nghĩa Đô", "Yên Hòa", "Mai Dịch"] },
      { name: "Ba Đình", wards: ["Phúc Xá", "Trúc Bạch", "Ngọc Hà", "Kim Mã"] },
      { name: "Hoàn Kiếm", wards: ["Hàng Bài", "Phúc Tân", "Hàng Gai", "Tràng Tiền"] },
      { name: "Đống Đa", wards: ["Láng Hạ", "Ô Chợ Dừa", "Khâm Thiên", "Văn Miếu"] },
      { name: "Thanh Xuân", wards: ["Nhân Chính", "Khương Đình", "Thanh Xuân Bắc"] },
    ],
  },
  {
    province: "Hồ Chí Minh",
    districts: [
      { name: "Quận 1", wards: ["Bến Nghé", "Cô Giang", "Nguyễn Thái Bình", "Tân Định"] },
      { name: "Quận 3", wards: ["Phường 1", "Phường 2", "Phường 4", "Võ Thị Sáu"] },
      { name: "Quận 10", wards: ["Phường 13", "Phường 14", "Phường 15"] },
      { name: "Bình Thạnh", wards: ["Phường 1", "Phường 2", "Phường 14", "Phường 25"] },
      { name: "Tân Bình", wards: ["Phường 1", "Phường 2", "Phường 4", "Phường 12"] },
    ],
  },
  {
    province: "Đà Nẵng",
    districts: [
      { name: "Hải Châu", wards: ["Thạch Thang", "Hòa Cường Bắc", "Hòa Cường Nam", "Bình Thuận"] },
      { name: "Sơn Trà", wards: ["An Hải Bắc", "An Hải Đông", "An Hải Tây", "Phước Mỹ"] },
      { name: "Thanh Khê", wards: ["Tam Thuận", "Thanh Khê Đông", "Chính Gián"] },
    ],
  },
];

interface LocationAutocompleteProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
}

function LocationAutocomplete({
  id,
  label,
  value,
  options,
  placeholder,
  onSelect,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const suggestions = options.filter((option) =>
    option.toLocaleLowerCase("vi").includes(normalizedQuery)
  );

  function selectOption(option: string) {
    setQuery(option);
    setIsOpen(false);
    onSelect(option);
  }

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-suggestions`}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setIsOpen(false);
              setQuery(value);
            }, 100);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && isOpen && suggestions[0]) {
              event.preventDefault();
              selectOption(suggestions[0]);
            }
            if (event.key === "Escape") {
              setIsOpen(false);
              setQuery(value);
            }
          }}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-xs font-semibold text-slate-900 outline-none focus:border-red-600 focus:bg-white"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {isOpen && (
        <div
          id={`${id}-suggestions`}
          role="listbox"
          aria-label={`Gợi ý ${label.toLowerCase()}`}
          className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={suggestion === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(suggestion)}
                className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"
              >
                {suggestion}
              </button>
            ))
          ) : (
            <p className="px-3 py-2.5 text-xs text-slate-500">Không tìm thấy gợi ý phù hợp</p>
          )}
        </div>
      )}
    </div>
  );
}

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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  const [saveAddress, setSaveAddress] = useState(true);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeship = subtotal >= FREESHIP_THRESHOLD;
  const shippingCost = subtotal > 0 ? (isFreeship ? 0 : SHIPPING_FEE) : 0;
  const totalAmount = subtotal + shippingCost;

  // Selected province's districts
  const currentProvinceData =
    LOCATION_OPTIONS.find((p) => p.province === province) || LOCATION_OPTIONS[0];
  const currentDistrictData =
    currentProvinceData.districts.find((d) => d.name === district) ||
    currentProvinceData.districts[0];

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

  function handleProvinceChange(newProv: string) {
    setProvince(newProv);
    const provData = LOCATION_OPTIONS.find((p) => p.province === newProv) || LOCATION_OPTIONS[0];
    const firstDistrict = provData.districts[0];
    setDistrict(firstDistrict.name);
    setWard(firstDistrict.wards[0]);
  }

  function handleDistrictChange(newDist: string) {
    setDistrict(newDist);
    const distData = currentProvinceData.districts.find((d) => d.name === newDist);
    if (distData && distData.wards.length > 0) {
      setWard(distData.wards[0]);
    }
  }

  const fullAddress = [street, ward, district, province].filter(Boolean).join(", ");

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !street.trim() || !ward || !district || !province) {
      toast.error("Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng");
      return;
    }

    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
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
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: fullAddress,
          items,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Đặt hàng thất bại");
      }

      setConfirmedOrder({
        id: data.order?.id,
        customerName,
        phone,
        address: fullAddress,
        totalAmount,
      });

      setSuccess(true);
      clearCart();
      toast.success("Đặt hàng thành công!");
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  // Success view
  if (success) {
    return (
      <div className="min-h-[75vh] bg-slate-50 px-4 py-16 flex items-center justify-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Đơn hàng hoàn tất
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Đặt Hàng Thành Công! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Cảm ơn bạn đã lựa chọn Hưng Badminton. Chúng tôi đã nhận được đơn hàng và sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </p>
          </div>

          {confirmedOrder && (
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-xs space-y-2">
              {confirmedOrder.id && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-bold text-slate-900 font-mono">{confirmedOrder.id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-semibold text-slate-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-semibold text-slate-900">{confirmedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ giao:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[280px]">
                  {confirmedOrder.address}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Tổng thanh toán:</span>
                <span className="text-red-600 text-sm font-black">
                  {confirmedOrder.totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-700 transition"
            >
              <Home className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-16 flex items-center justify-center">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Không có sản phẩm để thanh toán</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi tiến hành đặt hàng.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-red-700 transition"
          >
            <span>Khám phá sản phẩm</span>
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
            <Link href="/cart" className="hover:text-red-600 transition">
              Giỏ hàng
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Thanh toán</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Xác nhận đơn hàng
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thông Tin Giao Hàng & Thanh Toán
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Vui lòng kiểm tra kỹ địa chỉ và số điện thoại để đảm bảo nhận hàng đúng hẹn.
          </p>
        </div>

        {/* 2. CHECKOUT GRID */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
          {/* Left Column: Delivery Form */}
          <form onSubmit={handleOrder} className="space-y-6">
            {/* Saved Address Radio (if exists) */}
            {session?.user && hasSaved && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Địa chỉ đã lưu trong tài khoản
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="radio"
                        checked={useSavedAddress}
                        onChange={() => setUseSavedAddress(true)}
                        className="accent-red-600"
                      />
                      Dùng địa chỉ này
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="radio"
                        checked={!useSavedAddress}
                        onChange={() => setUseSavedAddress(false)}
                        className="accent-red-600"
                      />
                      Nhập địa chỉ mới
                    </label>
                  </div>
                </div>

                {useSavedAddress && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">{customerName} — {phone}</p>
                    <p className="text-slate-500 mt-0.5">{fullAddress}</p>
                  </div>
                )}
              </div>
            )}

            {/* Address Input Form */}
            {(!hasSaved || !useSavedAddress) && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Địa chỉ nhận hàng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <LocationAutocomplete
                      key={province}
                      id="province"
                      label="Tỉnh / Thành phố"
                      value={province}
                      options={LOCATION_OPTIONS.map((location) => location.province)}
                      placeholder="Gõ để tìm tỉnh/thành phố"
                      onSelect={handleProvinceChange}
                    />
                  </div>

                  <div>
                    <LocationAutocomplete
                      key={`${province}-${district}`}
                      id="district"
                      label="Quận / Huyện"
                      value={district}
                      options={currentProvinceData.districts.map((location) => location.name)}
                      placeholder="Gõ để tìm quận/huyện"
                      onSelect={handleDistrictChange}
                    />
                  </div>

                  <div>
                    <LocationAutocomplete
                      key={`${district}-${ward}`}
                      id="ward"
                      label="Phường / Xã"
                      value={ward}
                      options={currentDistrictData.wards}
                      placeholder="Gõ để tìm phường/xã"
                      onSelect={setWard}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Số 88 đường Cầu Giấy, Tòa nhà FPT"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                {session?.user && (
                  <label className="flex items-center gap-2 pt-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="h-4 w-4 rounded accent-red-600"
                    />
                    <span>Lưu địa chỉ này làm mặc định cho lần mua sau</span>
                  </label>
                )}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-600" />
                Phương thức thanh toán
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-red-600 bg-red-50/40 ring-1 ring-red-600/30"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="h-5 w-5 text-red-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-red-600"
                    />
                  </div>
                  <span className="font-bold text-xs text-slate-900">COD khi nhận hàng</span>
                  <span className="text-[11px] text-slate-500 mt-1">Kiểm tra hàng trước khi thanh toán</span>
                </label>

                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "banking"
                      ? "border-red-600 bg-red-50/40 ring-1 ring-red-600/30"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="h-5 w-5 text-red-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "banking"}
                      onChange={() => setPaymentMethod("banking")}
                      className="accent-red-600"
                    />
                  </div>
                  <span className="font-bold text-xs text-slate-900">Chuyển khoản VietQR</span>
                  <span className="text-[11px] text-slate-500 mt-1">Quét mã bằng ứng dụng ngân hàng</span>
                </label>

              </div>

              {paymentMethod === "banking" && (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm font-bold text-slate-900">Quét mã QR để chuyển khoản</p>
                  <Image
                    src="/qr-chuyen-khoan.png"
                    alt="Mã QR nhận chuyển khoản của Lê Xuân Hùng"
                    width={273}
                    height={333}
                    sizes="(max-width: 640px) 75vw, 273px"
                    unoptimized
                    className="h-auto w-full max-w-[273px] rounded-lg border border-slate-200 bg-white"
                  />
                  <p className="text-xs text-slate-600">
                    Vui lòng chuyển đúng tổng tiền đơn hàng: <strong className="text-slate-900">{totalAmount.toLocaleString("vi-VN")}₫</strong>
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* Right Column: Order Summary & Confirm Button */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
              Đơn Hàng ({items.reduce((acc, i) => acc + i.quantity, 0)} món)
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">🏸</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{item.name}</p>
                    <p className="text-slate-400">Số lượng: x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-bold text-slate-900">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-slate-900">
                  {isFreeship ? (
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  ) : (
                    `${SHIPPING_FEE.toLocaleString("vi-VN")}₫`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 text-sm">
                <div>
                  <span className="font-black text-slate-900 block">Tổng thanh toán</span>
                  <span className="text-[11px] text-slate-400">(Đã bao gồm VAT)</span>
                </div>
                <span className="text-xl font-black text-red-600">
                  {totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleOrder}
              disabled={loading}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận đặt hàng ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Bảo mật dữ liệu chuẩn mã hóa SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-red-600 shrink-0" />
                <span>Kiểm tra hàng trước khi thanh toán COD</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
