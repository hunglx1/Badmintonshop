"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      alert(result.error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.85)]">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Đăng nhập</p>
          <h1 className="mt-4 text-4xl font-extrabold text-white">Chào mừng trở lại</h1>
          <p className="mt-2 text-slate-400">Đăng nhập để tiếp tục mua sắm và lưu thông tin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-slate-100 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#CCFF00] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90 disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
