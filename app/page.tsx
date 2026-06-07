import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-[#080B14] text-white">
      <section className="relative overflow-hidden bg-[#0A0E1E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(204,255,0,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,255,202,0.14),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-[#CCFF00]">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00]">🏸</span>
                Premium Racket & Gear
              </span>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Cảm hứng chiến thắng
                <br />
                cùng Hưng Badmiton.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Hệ sinh thái cầu lông cao cấp với vợt, giày, túi và phụ kiện pro-level. Tối ưu hiệu suất, thiết kế đẳng cấp và cảm giác điều khiển tinh tế.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-[#CCFF00] px-8 py-4 text-sm font-semibold text-slate-950 shadow-[0_20px_40px_-20px_rgba(204,255,0,0.9)] transition hover:bg-[#daff00]/90">
                  Mua ngay
                </Link>
                <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-[#CCFF00]/50 hover:bg-white/10">
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
              <div className="relative h-[520px] overflow-hidden rounded-[1.75rem] bg-slate-950">
                <Image src="/hero.jpg" alt="Premium badminton" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Bộ sưu tập cao cấp</p>
            <h2 className="mt-4 text-4xl font-black text-white">Sản phẩm nổi bật</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Chọn lựa vợt, giày và phụ kiện chuẩn pro với hiệu suất tối ưu hóa cho mỗi trận đấu.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-700 bg-[#101623]/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] transition hover:-translate-y-1 hover:border-[#CCFF00]/60"
            >
              <div className="relative h-72 overflow-hidden bg-slate-950">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{product.brand}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl font-black text-[#CCFF00]">{product.price.toLocaleString()}₫</span>
                  <span className="rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-300">Chi tiết</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#0A0E1E] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Tinh tế",
                description: "Thiết kế vợt và phụ kiện cao cấp dành cho người chơi chuyên nghiệp.",
              },
              {
                title: "Hiệu suất",
                description: "Công nghệ hiện đại giúp cú đánh uy lực và kiểm soát chuẩn xác.",
              },
              {
                title: "Phong cách",
                description: "Phong cách tối giản, đậm chất thể thao và sang trọng.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-700 bg-[#121824]/80 p-8 text-slate-300 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-12 text-center shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]">
          <h2 className="text-4xl font-black text-white">Tư vấn lựa chọn sản phẩm pro-level</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Chọn vợt, giày và phụ kiện cầu lông phù hợp với phong cách chơi và mục tiêu thi đấu của bạn.
          </p>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-[#CCFF00] px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#daff00]/90">
            Khám phá ngay
          </Link>
        </div>
      </section>
    </main>
  );
}
