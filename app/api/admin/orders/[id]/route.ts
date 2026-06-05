import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  req: NextRequest,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const order = await prisma.order.update({
      where: {
        id,
      },

      data: {
        status: body.status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Cập nhật trạng thái thất bại",
      },
      {
        status: 500,
      }
    );
  }
}