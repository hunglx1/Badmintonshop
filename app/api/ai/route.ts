import { GoogleGenAI, type Content } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeRateLimit, getRateLimitKey, PayloadTooLargeError, readJsonBody } from "@/lib/api-request";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 32 * 1024;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const requestSchema = z.object({
  productId: z.string().uuid(),
  message: z.string().trim().min(1).max(1000),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(1000),
    }).strict()
  ).max(6).default([]),
}).strict();

function formatSpecs(specs: { key: string; value: string }[]) {
  return specs.map((spec) => `${spec.key}: ${spec.value}`).join(" | ");
}

function extractSlugs(text: string) {
  const matches = text.match(/\[slug:([a-z0-9]+(?:-[a-z0-9]+)*)\]/gi);
  if (!matches) return [];

  return [...new Set(matches.map((match) => match.slice(6, -1).toLowerCase()))];
}

function cleanText(text: string) {
  return text.replace(/\[slug:.*?\]/g, "");
}

export async function POST(req: Request) {
  try {
    const rateLimit = await consumeRateLimit(
      getRateLimitKey(req, "ai"),
      20,
      60 * 1000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu tư vấn. Vui lòng thử lại sau." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình GEMINI_API_KEY cho trợ lý AI." },
        { status: 500 }
      );
    }

    const body = await readJsonBody(req, MAX_BODY_BYTES);
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu tư vấn không hợp lệ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, message, history } = parsed.data;
    const gemini = new GoogleGenAI({ apiKey });

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

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        stock: { gt: 0 },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        name: true,
        slug: true,
        brand: true,
        price: true,
        stock: true,
        description: true,
        specifications: { select: { key: true, value: true } },
      },
    });

    const relatedText = relatedProducts
      .map(
        (p) =>
          `- ${p.name} | ${p.brand} | ${Number(p.price).toLocaleString("vi-VN")}đ | Tồn kho: ${p.stock} | ${p.description.slice(0, 180)} | ${formatSpecs(p.specifications)} | [slug:${p.slug}]`
      )
      .join("\n");

    const productInfo = `Tên: ${product.name}\nThương hiệu: ${product.brand}\nDanh mục: ${product.category.name}\nGiá hiện tại: ${Number(product.price).toLocaleString("vi-VN")}đ\nTồn kho: ${product.stock}\nMô tả trong cửa hàng: ${product.description}\nThông số: ${formatSpecs(product.specifications) || "Cửa hàng chưa cập nhật thông số."}`;

    const systemPrompt = `
Bạn là một trợ lý tư vấn bán hàng chuyên nghiệp cho cửa hàng cầu lông Hưng Badminton.
Khách hàng đang xem sản phẩm hiện tại bên dưới. Dữ liệu sản phẩm và danh sách gợi ý được lấy từ catalog của cửa hàng; đây là nguồn thông tin duy nhất về sản phẩm, giá và tồn kho.

QUY TẮC:
- Không trả lời bằng JSON.
- Trả lời tự nhiên, thân thiện và súc tích (khoảng 3-5 câu).
- Luôn gọi đúng tên, thương hiệu và danh mục; không nhầm vợt, giày, dây cước hoặc phụ kiện với nhau.
- Chỉ khẳng định thông số, công nghệ, giá, tồn kho và tính năng khi có trong dữ liệu catalog; nếu thiếu, hãy nói rõ cửa hàng chưa cung cấp. Có thể đưa nhận định phù hợp dựa trên thông số đã có và nhu cầu khách, nhưng phải nói đó là tư vấn tham khảo, không phải thông tin được nhà sản xuất xác nhận.
- Chỉ so sánh giá với đối thủ nếu khách cung cấp mức giá/nguồn cụ thể; cửa hàng không có dữ liệu giá thị trường realtime.
- Chỉ gợi ý sản phẩm có trong danh sách sản phẩm cùng danh mục bên dưới. Sản phẩm trong danh sách đều còn hàng; không bịa tên hoặc gợi ý sản phẩm ngoài danh sách.
- Khi gợi ý một sản phẩm trong danh sách, thêm đúng tag [slug:slug-san-pham] để giao diện hiển thị thẻ sản phẩm. Không tự tạo slug và không đưa tag ví dụ.
- Nếu không có sản phẩm phù hợp trong danh sách, hãy nói rõ thay vì gợi ý sản phẩm không có trong catalog.

SẢN PHẨM KHÁCH ĐANG XEM:
${productInfo}

SẢN PHẨM CÙNG DANH MỤC ĐANG CÒN HÀNG:
${relatedText || "Không có sản phẩm nào khác cùng danh mục đang còn hàng."}
`;

    const contents: Content[] = history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });

    const finalContent = response.text || "";

    const relatedSlugs = new Set(relatedProducts.map((related) => related.slug));
    const slugs = extractSlugs(finalContent)
      .filter((slug) => relatedSlugs.has(slug))
      .slice(0, 4);

    const suggestedProducts =
      slugs.length > 0
        ? await prisma.product.findMany({
            where: { slug: { in: slugs }, stock: { gt: 0 } },
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
    const suggestionsBySlug = new Map(
      suggestedProducts.map((suggestion) => [
        suggestion.slug,
        { ...suggestion, price: Number(suggestion.price) },
      ])
    );

    return NextResponse.json({
      answer: cleanText(finalContent),
      suggestedProducts: slugs
        .map((slug) => suggestionsBySlug.get(slug))
        .filter((suggestion) => suggestion !== undefined),
    });
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "Dữ liệu gửi lên quá lớn" }, { status: 413 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
    }

    console.error("GEMINI API ERROR:", error);

    return NextResponse.json(
      { error: "Trợ lý AI hiện không thể xử lý yêu cầu. Vui lòng thử lại sau." },
      { status: 503 }
    );
  }
}