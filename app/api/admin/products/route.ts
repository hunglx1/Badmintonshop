import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
req: NextRequest
) {
try {
const auth = await requireAdmin();

if (!auth.ok) {
  return NextResponse.json(
    {
      error: auth.message,
    },
    {
      status: auth.status,
    }
  );
}

const body = await req.json();

console.log("BODY:", body);

if (
  !body.name ||
  !body.slug ||
  !body.categoryId
) {
  return NextResponse.json(
    {
      error: "Thiếu dữ liệu bắt buộc",
    },
    {
      status: 400,
    }
  );
}

const product =
  await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      brand: body.brand,
      price: Number(body.price),
      stock: Number(body.stock),
      thumbnail: body.thumbnail,
      description: body.description,
      categoryId: body.categoryId,
    },
  });

return NextResponse.json(product);

} catch (error) {
console.error(error);


return NextResponse.json(
  {
    error: "Tạo sản phẩm thất bại",
  },
  {
    status: 500,
  }
);


}
}
