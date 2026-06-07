import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import AddToCartButton from "@/app/cart/AddToCartButton";
import ProductAIModal from "@/components/ai/ProductAIModal";
import ProductReviews from "@/components/products/ProductReviews";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: true,
      category: true,
      specifications: true,
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)] lg:p-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-950/80 h-[620px]">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
              <span className="inline-flex rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-4 py-2 text-sm font-semibold text-[#CCFF00]">{product.brand}</span>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-white">{product.name}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.35em] text-slate-500">{product.category.name}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-3xl bg-[#CCFF00] px-5 py-3 text-2xl font-bold text-slate-950">{product.price.toLocaleString()}₫</span>
                <span className="rounded-3xl border border-slate-700 bg-white/5 px-5 py-3 text-sm text-slate-300">Còn {product.stock} sản phẩm</span>
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <AddToCartButton product={product} />
                <ProductAIModal productId={product.id} />
              </div>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#CCFF00]/15 text-3xl text-[#CCFF00]">🏸</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Thông tin sản phẩm</h2>
                  <p className="text-sm text-slate-400">Chi tiết kỹ thuật và hiệu suất giúp bạn chọn chính xác.</p>
                </div>
              </div>
              <p className="text-slate-300 leading-8">{product.description}</p>
            </div>

            {product.specifications.length > 0 && (
              <section className="rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
                <h2 className="text-3xl font-bold text-white">Thông số kỹ thuật</h2>
                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-700 bg-[#0B0F19]">
                  <table className="w-full text-left text-sm text-slate-300">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.id} className="border-b border-slate-700 last:border-b-0">
                          <td className="w-1/3 px-6 py-4 font-semibold text-white">{spec.key}</td>
                          <td className="px-6 py-4">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>

        <ProductReviews productId={product.id} reviews={product.reviews} />

        {relatedProducts.length > 0 && (
          <section className="mt-24 rounded-[2rem] border border-slate-700 bg-[#121824]/90 p-8 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
            <h2 className="text-3xl font-bold text-white mb-8">Sản phẩm liên quan</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-700 bg-[#0B0F19] transition hover:-translate-y-1 hover:border-[#CCFF00]/60"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-950">
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-3 text-sm text-slate-400">{item.price.toLocaleString()}₫</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
