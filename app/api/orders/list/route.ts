import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}