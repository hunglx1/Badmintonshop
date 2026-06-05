import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const productCount =
    await prisma.product.count();

  const orderCount =
    await prisma.order.count();

  const orders =
    await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  const revenue =
    await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-10">
        📊 Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Tổng sản phẩm
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {productCount}
          </h2>

          <Link
            href="/admin/products"
            className="text-blue-600 mt-3 block"
          >
            Quản lý →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Tổng đơn hàng
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {orderCount}
          </h2>

          <Link
            href="/admin/orders"
            className="text-blue-600 mt-3 block"
          >
            Xem đơn →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Doanh thu
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {(revenue._sum.totalAmount || 0)
              .toLocaleString()}
            ₫
          </h2>
        </div>

      </div>

      <div className="mt-12">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Đơn hàng mới nhất
          </h2>

          <Link
            href="/admin/orders"
            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded
            "
          >
            Xem tất cả
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-100">

                <th className="p-3 border">
                  Khách hàng
                </th>

                <th className="p-3 border">
                  SĐT
                </th>

                <th className="p-3 border">
                  Tổng tiền
                </th>

                <th className="p-3 border">
                  Trạng thái
                </th>

                <th className="p-3 border">
                  Chi tiết
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
                    {order.phone}
                  </td>

                  <td className="border p-3">
                    {order.totalAmount.toLocaleString()}
                    ₫
                  </td>

                  <td className="border p-3">

                    <span
                      className={`
                        px-3 py-1 rounded text-sm
                        ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : ""
                        }
                        ${
                          order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : ""
                        }
                      `}
                    >
                      {order.status}
                    </span>

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

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}