import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

import { NextRequest, NextResponse } from "next/server";

export async function PUT(
req: NextRequest,
{
params,
}: {
params: Promise<{
id: string;
}>;
}
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

const { id } = await params;

const body = await req.json();

const product =
  await prisma.product.update({
    where: {
      id,
    },

    data: {
      name: body.name,
      slug: body.slug,
      brand: body.brand,
      price: Number(body.price),
      stock: Number(body.stock),
      thumbnail:
        body.thumbnail,
      description:
        body.description,
      categoryId:
        body.categoryId,
    },
  });

return NextResponse.json(
  product
);

} catch (error) {
console.error(error);

return NextResponse.json(
  {
    error:
      "Cập nhật sản phẩm thất bại",
  },
  {
    status: 500,
  }
);

}
}

export async function DELETE(
req: NextRequest,
{
params,
}: {
params: Promise<{
id: string;
}>;
}
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

const { id } = await params;

await prisma.product.delete({
  where: {
    id,
  },
});

return NextResponse.json({
  success: true,
});

} catch (error) {
console.error(error);

return NextResponse.json(
  {
    error:
      "Xóa sản phẩm thất bại",
  },
  {
    status: 500,
  }
);

}
}
