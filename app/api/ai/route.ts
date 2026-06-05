import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const IMPORTANT_SPECS = ["trọng lượng", "độ cứng", "chất liệu", "balance", "độ dài", "max tension", "lbs"];

function filterSpecs(specs: { key: string; value: string }[]) {
  const important = specs.filter((s) =>
    IMPORTANT_SPECS.some((k) => s.key.toLowerCase().includes(k))
  );

  const rest = specs.filter(
    (s) => !IMPORTANT_SPECS.some((k) => s.key.toLowerCase().includes(k))
  );

  return [...important, ...rest]
    .slice(0, 6)
    .map((s) => `${s.key}: ${s.value}`)
    .join(" | ");
}

// 🔥 extract slug từ AI text
function extractSlugs(text: string) {
  const matches = text.match(/\[slug:(.*?)\]/g);
  if (!matches) return [];

  return matches.map((m) =>
    m.replace("[slug:", "").replace("]", "")
  );
}

// 🔥 clean text để trả frontend
function cleanText(text: string) {
  return text.replace(/\[slug:.*?\]/g, "");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const body = await req.json();
    const { productId, message, history = [], cartItems = [] } = body;

    if (!productId || !message) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 1. PRODUCT
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        specifications: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // 2. RELATED
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        stock: { gt: 0 },
      },
      take: 4,
    });

    const relatedText = relatedProducts
      .map(
        (p) =>
          `${p.name} | ${p.brand} | ${p.price.toLocaleString("vi-VN")}đ [slug:${p.slug}]`
      )
      .join("\n");

    const systemPrompt = `
Bạn là tư vấn viên vợt cầu lông chuyên nghiệp.

Hãy trả lời tự nhiên như người bán hàng thật.

QUY TẮC:
- Không JSON
- Không format cứng
- Không được nói "xin lỗi"
- Trả lời tự nhiên như chat thật

KHI GỢI Ý SẢN PHẨM:
- luôn thêm tag: [slug:ten-san-pham]

Ví dụ:
Yonex rất phù hợp người mới.
[slug:yonex-arcsaber-11]
`;

    const chatHistory = history.slice(-6).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: message },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    let finalContent = response.choices[0]?.message?.content || "";

    // 🔥 extract products
    const slugs = extractSlugs(finalContent);

    // 🔥 query DB
    const suggestedProducts =
      slugs.length > 0
        ? await prisma.product.findMany({
            where: { slug: { in: slugs } },
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              thumbnail: true,
              brand: true,
            },
          })
        : [];

    return NextResponse.json({
      answer: cleanText(finalContent),
      suggestedProducts,
    });
  } catch (error) {
    console.error("GROQ ERROR:", error);

    return NextResponse.json(
      {
        answer:
          "Mình có thể giúp bạn chọn vợt phù hợp theo trình độ và lực tay nhé 🏸",
        suggestedProducts: [],
      },
      { status: 200 }
    );
  }
}