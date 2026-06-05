import Link from "next/link";
import { prisma } from "@/lib/prisma";

import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function ProductsAdmin() {
  const products =
    await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Quản lý sản phẩm
        </h1>

        <Link
          href="/admin/products/new"
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-5
            py-2
            rounded-lg
          "
        >
          ➕ Thêm sản phẩm
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="border p-3">
                Tên
              </th>

              <th className="border p-3">
                Hãng
              </th>

              <th className="border p-3">
                Giá
              </th>

              <th className="border p-3">
                Kho
              </th>

              <th className="border p-3">
                Thao tác
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr key={product.id}>

                <td className="border p-3">
                  {product.name}
                </td>

                <td className="border p-3">
                  {product.brand}
                </td>

                <td className="border p-3">
                  {product.price.toLocaleString()}₫
                </td>

                <td className="border p-3">
                  {product.stock}
                </td>

                <td className="border p-3">

                  <div className="flex gap-2">

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-3
                        py-2
                        rounded
                      "
                    >
                      ✏️ Sửa
                    </Link>

                    <DeleteProductButton
                      id={product.id}
                      name={product.name}
                    />

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}