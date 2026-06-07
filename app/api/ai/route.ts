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

    const productInfo = `Sản phẩm hiện tại: ${product.name} | ${product.brand} | ${product.category.name} | ${product.price.toLocaleString("vi-VN")}đ.`;
    const specsText = product.specifications.length
      ? `\nThông số: ${filterSpecs(product.specifications)}`
      : "";

    const systemPrompt = `
Bạn là một trợ lý tư vấn bán hàng chuyên nghiệp cho cửa hàng cầu lông Hưng Badminton.
Khách hàng đang xem chi tiết sản phẩm hiện tại.

Luôn sử dụng thông tin chính xác về sản phẩm hiện tại.
Nếu sản phẩm đang xem không phải vợt cầu lông, bạn phải trả lời đúng loại sản phẩm đó.
Không tự ý gán sản phẩm thành vợt khi nó là dây cước, giày, túi, phụ kiện, hay sản phẩm khác.

QUY TẮC:
- Không trả lời bằng JSON.
- Không đưa ra format cứng.
- Trả lời tự nhiên, thân thiện như người bán hàng thật.
- Nếu câu hỏi liên quan sản phẩm hiện tại, hãy dùng đúng tên, thương hiệu, danh mục.
- Nếu cần gợi ý sản phẩm khác, hãy thêm tag [slug:ten-san-pham] chỉ cho sản phẩm phù hợp.

Thông tin sản phẩm:
${productInfo}${specsText}

Sản phẩm liên quan:
${relatedText || "Không có sản phẩm liên quan."}

Ví dụ gợi ý sản phẩm:
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