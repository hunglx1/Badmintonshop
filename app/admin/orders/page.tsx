import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const orders =
    await prisma.order.findMany({
      include: {
        items: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Quản lý đơn hàng
      </h1>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">

            <th className="border p-3">
              Khách hàng
            </th>

            <th className="border p-3">
              Điện thoại
            </th>

            <th className="border p-3">
              Địa chỉ
            </th>

            <th className="border p-3">
              Tổng tiền
            </th>
            <th className="border p-3">
            Chi tiết
            </th>
            <th className="border p-3">
              Trạng thái
            </th>

            <th className="border p-3">
              Sản phẩm
            </th>

          </tr>
        </thead>

        <tbody>

          {orders.map((order) => (
            <tr key={order.id}>

              <td className="border p-3">
                {order.customerName}
              </td>
            <td className="border p-3">

            <Link
                href={`/admin/orders/${order.id}`}
                className="
                bg-blue-600
                text-white
                px-3
                py-2
                rounded
                "
            >
                Xem
            </Link>

            </td>
              <td className="border p-3">
                {order.phone}
              </td>

              <td className="border p-3">
                {order.address}
              </td>

              <td className="border p-3">
                {order.totalAmount.toLocaleString()}₫
              </td>

              <td className="border p-3">
                {order.status}
              </td>

              <td className="border p-3">
                {order.items.length}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}