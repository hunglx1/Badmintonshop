"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import CartBadge from "@/app/cart/CartBadge";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0F19]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] text-white transition hover:text-[#CCFF00]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00]">🏸</span>
          HƯNG BADMINTON
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            <Link href="/" className="transition hover:text-white">Trang chủ</Link>
            <Link href="/products" className="transition hover:text-white">Sản phẩm</Link>
            <Link href="/checkout" className="transition hover:text-white">Thanh toán</Link>
          </nav>

          <form action="/products" className="flex items-center gap-0 rounded-full border border-slate-700 bg-[#121824] px-2 shadow-[0_10px_40px_-30px_rgba(0,0,0,0.7)]">
            <input
              type="text"
              name="search"
              placeholder="Tìm vợt, giày, túi..."
              className="h-11 w-72 bg-transparent px-4 text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-[#CCFF00] px-4 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90">
              Tìm
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3">
          <CartBadge />
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="hidden rounded-full border border-[#CCFF00]/50 bg-[#CCFF00]/10 px-4 py-2 text-sm font-semibold text-[#CCFF00] transition hover:bg-[#CCFF00]/15 md:inline-flex">
                  Quản trị
                </Link>
              )}
              <span className="hidden text-sm text-slate-300 sm:inline">Xin chào, {session.user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff7d26]"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-slate-700 bg-[#121824] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-[#CCFF00] hover:text-white">
                Đăng nhập
              </Link>
              <Link href="/register" className="rounded-full bg-[#CCFF00] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
