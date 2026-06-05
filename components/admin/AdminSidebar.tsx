import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        p-6
      "
    >
      <h2 className="text-2xl font-bold mb-8">
        🏸 Admin
      </h2>

      <nav className="flex flex-col gap-3">

        <Link
          href="/admin"
          className="hover:bg-slate-800 p-3 rounded"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/admin/products"
          className="hover:bg-slate-800 p-3 rounded"
        >
          🏸 Sản phẩm
        </Link>

        <Link
          href="/admin/products/new"
          className="hover:bg-slate-800 p-3 rounded"
        >
          ➕ Thêm sản phẩm
        </Link>

        <Link
          href="/admin/orders"
          className="hover:bg-slate-800 p-3 rounded"
        >
          📦 Đơn hàng
        </Link>
        <Link
        href="/admin/categories"
        className="
            hover:bg-slate-800
            p-3
            rounded
        "
        >
        📂 Danh mục
        </Link>
      </nav>
    </aside>
  );
}