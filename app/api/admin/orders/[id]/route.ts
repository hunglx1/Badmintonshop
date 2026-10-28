import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { PayloadTooLargeError, readJsonBody } from "@/lib/api-request";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"]),
}).strict();

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
  SHIPPING: [OrderStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

class OrderNotFoundError extends Error {}
class InvalidOrderTransitionError extends Error {}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const body = await readJsonBody(req, 2 * 1024);
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Trạng thái đơn hàng không hợp lệ" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const order = await prisma.$transaction(async (transaction) => {
      const current = await transaction.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!current) throw new OrderNotFoundError();

      const nextStatus = parsed.data.status;
      if (current.status === nextStatus) return current;
      if (!validTransitions[current.status].includes(nextStatus)) {
        throw new InvalidOrderTransitionError();
      }

      const updated = await transaction.order.updateMany({
        where: { id, status: current.status },
        data: { status: nextStatus },
      });
      if (updated.count !== 1) throw new InvalidOrderTransitionError();

      if (nextStatus === OrderStatus.CANCELLED) {
        for (const item of current.items) {
          await transaction.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return transaction.order.findUniqueOrThrow({
        where: { id },
        include: { items: true },
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "Dữ liệu gửi lên quá lớn" }, { status: 413 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
    }
    if (error instanceof OrderNotFoundError) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }
    if (error instanceof InvalidOrderTransitionError) {
      return NextResponse.json({ error: "Không thể chuyển sang trạng thái này" }, { status: 409 });
    }

    console.error("Order status update failed:", error);
    return NextResponse.json(
      { error: "Cập nhật trạng thái thất bại" },
      { status: 500 }
    );
  }
}
