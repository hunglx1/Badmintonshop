import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { consumeRateLimit, getRateLimitKey, PayloadTooLargeError, readJsonBody } from "@/lib/api-request";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  phone: z.string().trim().transform((value) => value.replace(/[\s().-]/g, "")).pipe(
    z.string().regex(/^(?:\+84|0)\d{9,10}$/, "Số điện thoại không hợp lệ")
  ),
  address: z.string().trim().min(1).max(500),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(20),
    }).strict()
  ).min(1).max(20),
}).strict().superRefine(({ items }, context) => {
  const productIds = items.map((item) => item.productId);
  if (new Set(productIds).size !== productIds.length) {
    context.addIssue({
      code: "custom",
      path: ["items"],
      message: "Sản phẩm bị trùng trong giỏ hàng",
    });
  }
});

const MAX_BODY_BYTES = 16 * 1024;
const FREE_SHIPPING_THRESHOLD = new Prisma.Decimal(1_000_000);
const SHIPPING_FEE = new Prisma.Decimal(30_000);

class OrderRequestError extends Error {}

export async function POST(
  req: NextRequest
) {
  try {
    const rateLimit = await consumeRateLimit(
      getRateLimitKey(req, "orders"),
      5,
      10 * 60 * 1000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu đặt hàng. Vui lòng thử lại sau." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await readJsonBody(req, MAX_BODY_BYTES);
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Thông tin đơn hàng không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (transaction) => {
      const { customerName, phone, address, items } = parsed.data;
      const products = await transaction.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
        select: { id: true, name: true, price: true },
      });

      if (products.length !== items.length) {
        throw new OrderRequestError("Một hoặc nhiều sản phẩm không còn tồn tại.");
      }

      const productsById = new Map(products.map((product) => [product.id, product]));
      const orderItems: Array<{
        productId: string;
        quantity: number;
        price: Prisma.Decimal;
      }> = [];
      let subtotal = new Prisma.Decimal(0);

      for (const item of items) {
        const product = productsById.get(item.productId);
        if (!product) {
          throw new OrderRequestError("Một hoặc nhiều sản phẩm không còn tồn tại.");
        }

        const stockUpdate = await transaction.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (stockUpdate.count !== 1) {
          throw new OrderRequestError(`Sản phẩm "${product.name}" không đủ tồn kho.`);
        }

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
        subtotal = subtotal.plus(product.price.mul(item.quantity));
      }

      const totalAmount = subtotal.plus(
        subtotal.gte(FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_FEE
      );

      return transaction.order.create({
        data: {
          customerName,
          phone,
          address,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        select: { id: true, totalAmount: true, status: true, createdAt: true },
      });
    });

    console.info("Order created", { orderId: order.id, itemCount: parsed.data.items.length });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "Dữ liệu gửi lên quá lớn" }, { status: 413 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
    }

    if (error instanceof OrderRequestError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

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