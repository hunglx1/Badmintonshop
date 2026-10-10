import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* 1. Value propositions banner */}
      <div className="border-b border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Chuẩn Thi Đấu</h4>
                <p className="text-xs text-slate-400">Cam kết nhập khẩu uy tín</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-slate-400">Đóng gói chống sốc chuyên dụng</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Đổi Trả Trong 7 Ngày</h4>
                <p className="text-xs text-slate-400">Hỗ trợ đổi size linh hoạt</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Căng Cước Chuyên Nghiệp</h4>
                <p className="text-xs text-slate-400">Máy căng điện tử chuẩn số cân</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
                <span className="text-xl">🏸</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black uppercase tracking-wider text-white">
                  HƯNG BADMINTON
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 -mt-1">
                  PREMIUM SPORTS GEAR
                </span>
              </div>
            </Link>

            <p className="text-sm leading-6 text-slate-400 max-w-sm">
              Hệ thống bán lẻ vợt cầu lông, giày thể thao và phụ kiện thi đấu chuyên nghiệp. Chúng tôi đồng hành cùng mọi cú đánh và đam mê thể thao của bạn.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>Showroom: Số 88 Cầu Giấy, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-red-500 shrink-0" />
                <span>Hotline: 1900 1234 (8:00 - 21:30)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <span>Email: contact@hungbadminton.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-red-500 shrink-0" />
                <span>Giờ mở cửa: 08:00 – 21:30 (Cả Thứ 7 & CN)</span>
              </div>
            </div>
          </div>

          {/* Product categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Danh mục sản phẩm
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=vot-cau-long" className="hover:text-red-400 transition">
                  Vợt cầu lông
                </Link>
              </li>
              <li>
                <Link href="/products?category=giay-cau-long" className="hover:text-red-400 transition">
                  Giày cầu lông
                </Link>
              </li>
              <li>
                <Link href="/products?category=tui-cau-long" className="hover:text-red-400 transition">
                  Túi & Balo vợt
                </Link>
              </li>
              <li>
                <Link href="/products?category=day-cuoc" className="hover:text-red-400 transition">
                  Dây cước cầu lông
                </Link>
              </li>
              <li>
                <Link href="/products?category=phu-kien" className="hover:text-red-400 transition">
                  Phụ kiện thể thao
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-400 transition">
                  Tất cả sản phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer support */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Chính sách & Dịch vụ
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products" className="hover:text-red-400 transition">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-400 transition">
                  Chính sách đổi trả 7 ngày
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-400 transition">
                  Quy trình căng cước máy điện tử
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-400 transition">
                  Hướng dẫn chọn trọng lượng vợt (3U/4U)
                </Link>
              </li>
              <li>
                <Link href="/#ai-advisor" className="hover:text-red-400 transition">
                  Tư vấn chọn vợt AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands & payment */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Thương hiệu hợp tác
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Yonex", "Victor", "Li-Ning", "Mizuno", "Kawasaki", "Apacs"].map((brand) => (
                <Link
                  key={brand}
                  href={`/products?brand=${brand}`}
                  className="rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-red-500 hover:text-white transition"
                >
                  {brand}
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Thanh toán an toàn</h4>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-medium">
                <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700">COD</span>
                <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700">Chuyển khoản</span>
                <span className="rounded bg-slate-800 px-2 py-1 border border-slate-700">VNPAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom copyright */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hưng Badminton Store. Tất cả quyền được bảo lưu.</p>
          <p className="text-slate-500">
            Hệ sinh thái mua sắm dụng cụ thể thao chuyên nghiệp hàng đầu Việt Nam.
          </p>
        </div>
      </div>
    </footer>
  );
}
