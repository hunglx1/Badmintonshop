import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Eye,
  ShieldCheck,
  FolderTree,
} from "lucide-react";

export default async function AdminPage() {
  const [productCount, orderCount, categoryCount, orders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
              <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
              Bảng điều khiển quản trị
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quản Trị Hệ Thống Hưng Badminton
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Theo dõi doanh số, quản lý danh mục sản phẩm và xử lý đơn hàng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:border-red-300 hover:text-red-600 transition"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Sản phẩm</span>
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:border-red-300 hover:text-red-600 transition"
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>Danh mục</span>
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Tất cả đơn hàng</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng sản phẩm
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{productCount}</p>
              <Link
                href="/admin/products"
                className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
              >
                Quản lý kho →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Package className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng đơn hàng
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{orderCount}</p>
              <Link
                href="/admin/orders"
                className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
              >
                Xem chi tiết →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Danh mục
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{categoryCount}</p>
              <Link
                href="/admin/categories"
                className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
              >
                Xem danh mục →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FolderTree className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tổng doanh thu
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-red-600">
                {(revenue._sum.totalAmount || 0).toLocaleString("vi-VN")}₫
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Tích lũy từ đơn đặt</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Đơn Hàng Mới Nhất
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Danh sách các đơn đặt hàng mới cập nhật gần đây.</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Khách hàng</th>
                  <th className="px-4 py-3.5">Số điện thoại</th>
                  <th className="px-4 py-3.5">Tổng tiền</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.phone}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {Number(order.totalAmount).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          order.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600 transition"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Xem</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}