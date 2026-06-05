import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const {
      customerName,
      phone,
      address,
      totalAmount,
      items,
    } = body;

    // Validate
    if (
      !customerName ||
      !phone ||
      !address
    ) {
      return NextResponse.json(
        {
          error:
            "Vui lòng nhập đầy đủ thông tin",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Giỏ hàng đang trống",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await prisma.order.create({
        data: {
          customerName,
          phone,
          address,
          totalAmount,

          items: {
            create: items.map(
              (item: any) => ({
                productId: item.id,
                quantity:
                  item.quantity,
                price: item.price,
              })
            ),
          },
        },

        include: {
          items: true,
        },
      });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Tạo đơn hàng thất bại",
      },
      {
        status: 500,
      }
    );
  }
}