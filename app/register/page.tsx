"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight, Home, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Vui lòng điền đầy đủ họ tên, email và mật khẩu");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Đăng ký không thành công");
        return;
      }

      toast.success("Đăng ký tài khoản thành công!", {
        description: "Vui lòng đăng nhập với tài khoản mới.",
      });

      setTimeout(() => router.push("/login"), 1000);
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm transition group-hover:scale-105">
              <span className="text-xl">🏸</span>
            </div>
            <span className="text-lg font-black uppercase tracking-wider text-slate-900">
              HƯNG BADMINTON
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gia nhập cộng đồng người chơi cầu lông và lưu thông tin mua sắm nhanh chóng.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-xs text-slate-900 outline-none transition focus:border-red-600 focus:bg-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="tenban@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-xs text-slate-900 outline-none transition focus:border-red-600 focus:bg-white"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Mật khẩu (tối thiểu 6 ký tự)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-xs text-slate-900 outline-none transition focus:border-red-600 focus:bg-white"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Đăng ký tài khoản</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3 text-xs text-slate-500">
          <p>
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-bold text-red-600 hover:text-red-700">
              Đăng nhập ngay
            </Link>
          </p>
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600">
              <Home className="h-3 w-3" />
              <span>Quay về trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
