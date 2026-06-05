"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import CartBadge from "@/app/cart/CartBadge";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const { data: session } = useSession();

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const isAdmin = session?.user?.role === "ADMIN";

  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-green-600"
        >
          🏸 Hưng Badminton
        </Link>

        <form
          action="/products"
          className="hidden md:flex"
        >
          <input
            type="text"
            name="search"
            placeholder="Tìm vợt, giày, túi..."
            className="
              border
              rounded-l-xl
              px-4
              py-2
              w-72
              outline-none
            "
          />

          <button
            className="
              bg-green-600
              text-white
              px-4
              rounded-r-xl
            "
          >
            🔍
          </button>
        </form>

        <nav className="flex items-center gap-6">
          {!isAdmin && (
            <>
              <Link
                href="/"
                className="hover:text-green-600"
              >
                Trang chủ
              </Link>

              <Link
                href="/products"
                className="hover:text-green-600"
              >
                Sản phẩm
              </Link>

              <Link
                href="/checkout"
                className="hover:text-green-600"
              >
                Thanh toán
              </Link>

              <CartBadge />
            </>
          )}

          {session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-medium text-green-600"
                >
                  Dashboard
                </Link>
              )}

              <span className="text-sm">
                Xin chào {session.user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-red-500 text-white"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 border rounded"
              >
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className="px-3 py-2 rounded bg-green-600 text-white"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}