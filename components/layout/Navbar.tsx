"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Search,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import CartBadge from "@/app/cart/CartBadge";

const NAV_CATEGORIES = [
  { name: "Vợt cầu lông", href: "/products?category=vot-cau-long" },
  { name: "Giày cầu lông", href: "/products?category=giay-cau-long" },
  { name: "Túi & Balo", href: "/products?category=tui-cau-long" },
  { name: "Dây cước", href: "/products?category=day-cuoc" },
  { name: "Phụ kiện", href: "/products?category=phu-kien" },
  { name: "Khuyến mãi", href: "/products?minPrice=0&maxPrice=1000000", highlight: true },
];

const FEATURED_BRANDS = [
  { name: "Yonex", href: "/products?brand=Yonex" },
  { name: "Victor", href: "/products?brand=Victor" },
  { name: "Li-Ning", href: "/products?brand=Lining" },
  { name: "Mizuno", href: "/products?brand=Mizuno" },
  { name: "Kawasaki", href: "/products?brand=Kawasaki" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.replace("/login");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all border-b border-slate-200">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium text-slate-300">
              Miễn phí vận chuyển cho đơn hàng từ <strong className="text-white">1.000.000₫</strong> toàn quốc
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <PhoneCall className="h-3 w-3 text-red-500" />
              Hotline: <strong className="text-slate-200">1900 1234</strong> (8:00 - 21:30)
            </span>
            <span className="text-slate-600">|</span>
            <Link href="/products" className="hover:text-red-400 transition">
              Cam kết 100% chuẩn thi đấu
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition-transform group-hover:scale-105">
              <span className="text-xl sm:text-2xl">🏸</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 group-hover:text-red-600 transition">
                HƯNG BADMINTON
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 -mt-1">
                PREMIUM SPORTS GEAR
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm vợt Yonex, giày bám sân, túi đựng, cước..."
                className="w-full rounded-full border border-slate-300 bg-slate-50/70 py-2.5 pl-11 pr-24 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 shadow-sm"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* User actions & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Advisor Quick Link */}
            <Link
              href="/#ai-advisor"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-red-600" />
              <span>Tư vấn AI</span>
            </Link>

            {/* Cart Badge */}
            <CartBadge />

            {/* Auth section */}
            {session ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:inline-flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    Admin
                  </Link>
                )}

                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[120px]">
                    {session.user?.name || "Tài khoản"}
                  </span>
                  <span className="text-[10px] text-slate-500">Khách hàng</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:text-red-600"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                  <span className="hidden md:inline">Thoát</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
                >
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="lg:hidden mt-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm vợt, giày, cước, túi..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-20 text-xs text-slate-900 outline-none focus:border-red-600 focus:bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Link
              href="/products"
              className="px-4 py-3 text-slate-700 transition hover:text-red-600 flex items-center gap-1 border-b-2 border-transparent hover:border-red-600"
            >
              Tất cả sản phẩm
            </Link>

            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`px-4 py-3 transition flex items-center gap-1 border-b-2 border-transparent hover:border-red-600 ${
                  cat.highlight
                    ? "text-red-600 hover:text-red-700 font-extrabold"
                    : "text-slate-700 hover:text-red-600"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Quick Brand Links */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold lowercase">
            <span className="uppercase text-slate-400 font-bold tracking-wider">Thương hiệu:</span>
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="hover:text-red-600 transition capitalize"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-xl">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Danh mục sản phẩm
            </p>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-red-600"
            >
              Tất cả sản phẩm
            </Link>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  cat.highlight
                    ? "text-red-600 bg-red-50"
                    : "text-slate-800 hover:bg-slate-50 hover:text-red-600"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Thương hiệu hàng đầu
            </p>
            <div className="grid grid-cols-3 gap-2 px-1">
              {FEATURED_BRANDS.map((b) => (
                <Link
                  key={b.name}
                  href={b.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-200 py-1.5 text-center text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <Link
              href="/#ai-advisor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700"
            >
              <Sparkles className="h-4 w-4 text-red-600" />
              Tư vấn chọn vợt bằng AI
            </Link>
            {session && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-800"
              >
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                Trang quản trị (Admin)
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
