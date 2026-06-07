export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-3xl border border-[#CCFF00]/20 bg-[#121824]/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#CCFF00] shadow-[0_20px_60px_-40px_rgba(204,255,0,0.6)]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00]">🏸</span>
              HUNG RACKET
            </div>
            <p className="text-sm leading-7 text-slate-400">
              Chuyên vợt và phụ kiện thể thao cao cấp cho người chơi cầu lông và tennis. Giao nhanh, phục vụ pro-level.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Sản phẩm</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>Vợt</li>
              <li>Giày</li>
              <li>Túi</li>
              <li>Phụ kiện</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>Đổi trả</li>
              <li>Bảo hành</li>
              <li>Giao hàng</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Liên hệ</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>Hotline: 1900 1234</p>
              <p>Email: contact@hungbadminton.vn</p>
              <p>Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} HUNG RACKET. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
