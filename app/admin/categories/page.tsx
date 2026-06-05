import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {

  const categories =
    await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

  return (
    <div className="p-8">

      <div className="flex justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Danh mục
        </h1>

        <Link
          href="/admin/categories/new"
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Thêm danh mục
        </Link>

      </div>

      <table className="w-full border">

        <thead>

          <tr>

            <th className="border p-3">
              Tên
            </th>

            <th className="border p-3">
              Slug
            </th>

            <th className="border p-3">
              Số sản phẩm
            </th>

          </tr>

        </thead>

        <tbody>

          {categories.map(
            (category) => (
              <tr
                key={category.id}
              >
                <td className="border p-3">
                  {category.name}
                </td>

                <td className="border p-3">
                  {category.slug}
                </td>

                <td className="border p-3">
                  {
                    category
                      ._count
                      .products
                  }
                </td>
              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}