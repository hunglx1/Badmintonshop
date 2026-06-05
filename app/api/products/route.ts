import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get("category") || undefined;
    const brands       = searchParams.getAll("brand");
    const minPrice     = searchParams.get("minPrice");
    const maxPrice     = searchParams.get("maxPrice");
    const search       = searchParams.get("search")   || undefined;
    const page         = parseInt(searchParams.get("page") || "1");
    const limit        = parseInt(searchParams.get("limit") || "12");

    const where = {
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
      ...(brands.length > 0 && {
        brand: { in: brands },
      }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice ? { gte: parseInt(minPrice) } : {}),
          ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
        },
      }),
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category:       { select: { name: true, slug: true } },
          specifications: true,
          reviews:        { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi tải sản phẩm" },
      { status: 500 }
    );
  }
}