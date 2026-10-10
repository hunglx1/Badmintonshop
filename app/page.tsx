import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  CheckCircle2,
  Tag,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import HomeAIAdvisor from "@/components/home/HomeAIAdvisor";

const CATEGORY_META: Record<string, { icon: string; desc: string; tag: string }> = {
  "vot-cau-long": {
    icon: "🏸",
    desc: "Vợt tấn công, công thủ toàn diện & tốc độ phản xạ",
    tag: "30+ Mẫu sẵn có",
  },
  "giay-cau-long": {
    icon: "👟",
    desc: "Đế Power Cushion bám sân, đệm êm chống lật cổ chân",
    tag: "20+ Mẫu cao cấp",
  },
  "tui-cau-long": {
    icon: "🎒",
    desc: "Túi đựng vợt 6-9 cây, balo thể thao cách nhiệt",
    tag: "Chống thấm nước",
  },
  "day-cuoc": {
    icon: "🪢",
    desc: "Cước Nanogy, BG65, BG80 trợ lực nổ cầu giòn tan",
    tag: "Căng máy điện tử",
  },
  "phu-kien": {
    icon: "🛍️",
    desc: "Quấn cán cao su, băng chặn mồ hôi, bao bảo vệ khung",
    tag: "Tiêu chuẩn thi đấu",
  },
};

const BRANDS = [
  {
    name: "Yonex",
    country: "Nhật Bản",
    slogan: "Thương hiệu số 1 thế giới được các tay vợt hàng đầu tin dùng",
    slug: "Yonex",
  },
  {
    name: "Victor",
    country: "Đài Loan",
    slogan: "Công nghệ khung Aero-Sword và dòng Thruster uy lực",
    slug: "Victor",
  },
  {
    name: "Li-Ning",
    country: "Trung Quốc",
    slogan: "Đỉnh cao thiết kế Axforce và công nghệ sợi carbon T900",
    slug: "Lining",
  },
  {
    name: "Mizuno",
    country: "Nhật Bản",
    slogan: "Công nghệ đế Wave Plate giảm chấn tối ưu cho bàn chân châu Á",
    slug: "Mizuno",
  },
  {
    name: "Kawasaki",
    country: "Nhật Bản",
    slogan: "Độ bền vượt trội, giá thành hợp lý cho người chơi phong trào",
    slug: "Kawasaki",
  },
  {
    name: "Apacs",
    country: "Malaysia",
    slogan: "Khung vợt chịu lực căng cao, bền bỉ và dễ làm quen",
    slug: "Apacs",
  },
];

export default async function HomePage() {
  // Fetch real data from Prisma database
  const [categories, bestSellers, newArrivals, racketList] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    prisma.product.findMany({
      take: 8,
      include: {
        category: true,
        reviews: true,
      },
      orderBy: { price: "desc" },
    }),
    prisma.product.findMany({
      take: 8,
      include: {
        category: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { category: { slug: "vot-cau-long" } },
      take: 4,
      include: {
        category: true,
        reviews: true,
      },
      orderBy: { price: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16 bg-slate-50">
      {/* ─────────────────────────────────────────────────────────────
          SECTION A: HERO BANNER
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Subtle sport lighting patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(220,38,38,0.25),_transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(15,23,42,0.9),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Hệ Sinh Thái Cầu Lông Chuyên Nghiệp
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.1]">
                CHINH PHỤC ĐỈNH CAO
                <br />
                <span className="text-red-500">BỨT PHÁ TỪNG CÚ ĐÁNH</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
                Hưng Badminton cung cấp các dòng vợt thi đấu, giày bám sân và phụ kiện chuẩn chuyên nghiệp từ Yonex, Victor, Li-Ning. Tư vấn thông số chuẩn xác cho từng lối chơi.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 active:scale-95"
                >
                  <span>Khám phá sản phẩm</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/#ai-advisor"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:border-red-500 hover:text-white"
                >
                  <Sparkles className="h-4 w-4 text-red-400" />
                  <span>Tư vấn chọn vợt AI</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400 shrink-0" />
                  <span>100% Chính hãng</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Căng cước máy điện tử</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Đổi size trong 7 ngày</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-800/40 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
                <div className="relative h-80 sm:h-[420px] w-full overflow-hidden rounded-2xl bg-slate-900/80">
                  <Image
                    src="/hero.jpg"
                    alt="Vợt và quả cầu lông chuyên nghiệp Hưng Badminton"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Bộ Sưu Tập 2024
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-white">
                      Yonex Astrox 100ZZ & Victor Ryuga Metallic
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Công nghệ carbon Namd & Pyrofil tạo lực smash xuyên phá
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: FEATURED CATEGORIES
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
              <Tag className="h-3.5 w-3.5" />
              <span>Phân loại trang bị</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Danh Mục Sản Phẩm Nổi Bật
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-red-600 transition"
          >
            Tất cả danh mục <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] || {
              icon: "🏸",
              desc: "Sản phẩm thể thao chính hãng",
              tag: "Chính hãng",
            };

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl transition-transform group-hover:scale-110 group-hover:bg-red-50">
                    {meta.icon}
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 group-hover:text-red-600 transition text-base">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-red-600 transition">
                  <span>{cat._count?.products || 0} sản phẩm</span>
                  <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: SẢN PHẨM BÁN CHẠY (BEST SELLERS)
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
              <Flame className="h-3.5 w-3.5 text-red-600" />
              Sản phẩm thịnh hành
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Bán Chạy Nhất
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Các mẫu vợt và giày được ưa chuộng hàng đầu bởi các vận động viên và tay vợt phong trào.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
          >
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              thumbnail={product.thumbnail}
              price={product.price}
              brand={product.brand}
              stock={product.stock}
              category={product.category}
              reviews={product.reviews}
              badge="Bán chạy"
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION E: PROMOTION & HIGHLIGHT BANNERS
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Dịch vụ chuyên nghiệp
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Căng Cước Máy Điện Tử Chuẩn Số Cân
              </h3>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Áp dụng quy trình căng 4 nút chuẩn quốc tế cho mọi dòng vợt Yonex, Victor, Li-Ning. Tặng kèm quấn cán cao su cao cấp.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/products?category=day-cuoc"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-slate-100"
              >
                <span>Xem các dòng cước</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-8 text-white shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block rounded-md bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                Ưu đãi giày thi đấu
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Giày Bám Sân Power Cushion & Wave Claw
              </h3>
              <p className="text-sm text-red-100 max-w-md leading-relaxed">
                Bảo vệ khớp cổ chân, hấp thụ xung lực khi bật nhảy smash. Đầy đủ size 39 đến 44 cho nam và nữ.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/products?category=giay-cau-long"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-900"
              >
                <span>Xem mẫu giày mới</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION D: SẢN PHẨM MỚI VỀ (NEW ARRIVALS)
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              Cập nhật mới
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Mới Về
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Trang bị mới nhất vừa cập bến showroom Hưng Badminton.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
          >
            Khám phá thêm <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              thumbnail={product.thumbnail}
              price={product.price}
              brand={product.brand}
              stock={product.stock}
              category={product.category}
              reviews={product.reviews}
              badge="Mới về"
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION F: THƯƠNG HIỆU ĐỒNG HÀNH (BRANDS)
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Đối tác phân phối
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thương Hiệu Cầu Lông Quốc Tế
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            100% sản phẩm có nguồn gốc xuất xứ rõ ràng từ các nhà sản xuất hàng đầu thế giới.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={`/products?brand=${b.slug}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
            >
              <span className="text-lg font-black tracking-wider text-slate-900 group-hover:text-red-600 transition">
                {b.name}
              </span>
              <span className="mt-1 text-[11px] font-semibold text-slate-400">
                {b.country}
              </span>
              <span className="mt-3 text-[10px] text-red-600 font-bold opacity-0 transition group-hover:opacity-100 flex items-center gap-0.5">
                Xem sản phẩm <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION G: TƯ VẤN CHỌN VỢT BẰNG AI (AI ADVISOR)
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeAIAdvisor />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION H: CAM KẾT DỊCH VỤ & CHÍNH SÁCH
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Vì sao chọn Hưng Badminton?
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cam Kết Chất Lượng & Dịch Vụ Vượt Trội
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Đem lại trải nghiệm mua sắm an tâm và chuyên nghiệp nhất cho cộng đồng yêu thích cầu lông.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Giao Hàng Toàn Quốc</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vận chuyển hỏa tốc. Đóng gói trong ống cứng hoặc hộp chuyên dụng chịu lực bảo vệ nguyên vẹn khung vợt.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Đổi Trả Trong 7 Ngày</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hỗ trợ đổi size giày thể thao linh hoạt và giải quyết nhanh chóng mọi vấn đề phát sinh từ nhà sản xuất.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Căng Cước Máy Điện Tử</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kỹ thuật viên kinh nghiệm căng chuẩn số lbs yêu cầu bằng máy điện tử hiện đại, giữ khung vợt luôn tròn đều.
              </p>
            </div>

            <div className="flex flex-col items-start space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tư Vấn Kỹ Thuật Chuẩn</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đội ngũ chuyên viên tư vấn đúng lực tay (3U/4U/5U), điểm cân bằng và độ cứng thân vợt phù hợp trình độ.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
