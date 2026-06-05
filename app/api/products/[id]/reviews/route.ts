import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
    const { id } = await params;

    const body =
      await req.json();

    const review =
      await prisma.review.create({
        data: {
          productId: id,
          name: body.name,
          rating: Number(
            body.rating
          ),
          comment:
            body.comment,
        },
      });

    return NextResponse.json(
      review
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Tạo đánh giá thất bại",
      },
      {
        status: 500,
      }
    );
  }
}