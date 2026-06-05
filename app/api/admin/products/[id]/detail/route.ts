import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Không tìm thấy sản phẩm",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      product
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Lỗi",
      },
      {
        status: 500,
      }
    );
  }
}