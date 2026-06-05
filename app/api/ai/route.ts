import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, message, history = [], cartItems = [] } = body;

    if (!productId || !message) {
      return NextResponse.json({ error: "Thiếu productId hoặc câu hỏi" }, { status: 400 });
    }

    // 1. Sản phẩm chính
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        specifications: true,
        category: true,
        reviews: { orderBy: { createdAt: "desc" }, take: 3 },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    // 2. Sản phẩm cùng danh mục
    const relatedProducts = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: productId }, stock: { gt: 0 } },
      include: { specifications: true },
      orderBy: { price: "asc" },
      take: 4,
    });

    // 3. Build context
    const avgRating =
      product.reviews.length > 0
        ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
        : "chưa có";

    // Map slug để AI có thể trả về đúng slug cho card
    const relatedText = relatedProducts
      .map((p) => `• [slug:${p.slug}] ${p.name} | ${p.brand} | ${p.price.toLocaleString("vi-VN")}đ | ${filterSpecs(p.specifications)}`)
      .join("\n");

    const cartText =
      cartItems.length > 0
        ? cartItems.map((i: { name: string; quantity: number }) => `${i.name} x${i.quantity}`).join(", ")
        : "trống";

    const chatHistory = history
      .slice(-6)
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const systemPrompt = `Bạn là tư vấn viên của Hưng Badminton. Trả lời tiếng Việt, thân thiện, súc tích.

QUAN TRỌNG - Luôn trả về JSON hợp lệ theo đúng format sau, không thêm text bên ngoài JSON:
{
  "answer": "Câu trả lời dạng markdown cho khách hàng",
  "suggestedSlugs": ["slug-1", "slug-2"],
  "competitors": [
    { "name": "Tên sản phẩm đối thủ", "brand": "Hãng", "price": "Giá VNĐ", "source": "Tên shop/website" }
  ]
}

Quy tắc:
- "answer": trả lời đầy đủ, dùng bullet points khi liệt kê, KHÔNG chèn link vào đây
- "suggestedSlugs": mảng slug sản phẩm trong DB phù hợp với câu hỏi (tối đa 2, để [] nếu không cần)
- "competitors": CHỈ điền khi khách hỏi so sánh đối thủ hoặc giá thị trường, để [] nếu không hỏi
- Chỉ dùng thông tin được cung cấp, không bịa thông số kỹ thuật

---
SẢN PHẨM ĐANG XEM:
Tên: ${product.name} [slug:${product.slug}]
Hãng: ${product.brand} | Danh mục: ${product.category.name}
Giá: ${product.price.toLocaleString("vi-VN")}đ | ★${avgRating}
Mô tả: ${product.description.slice(0, 250)}
Specs: ${filterSpecs(product.specifications)}

SẢN PHẨM CÙNG LOẠI:
${relatedText || "Không có"}

GIỎ HÀNG: ${cartText}`;

    // 4. Gọi Groq với web search tool để lấy giá đối thủ realtime
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Tìm kiếm giá sản phẩm cầu lông trên các shop online Việt Nam để so sánh với đối thủ cạnh tranh. Chỉ dùng khi khách hỏi về so sánh giá hoặc đối thủ.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Từ khóa tìm kiếm, ví dụ: 'vợt cầu lông Yonex Astrox 99 giá shopee lazada 2024'",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
      max_tokens: 1000,
      temperature: 0.5,
    });

    let finalContent = response.choices[0]?.message?.content ?? "";

    // 5. Nếu AI muốn search web → thực hiện search qua Groq
    if (response.choices[0]?.finish_reason === "tool_calls") {
      const toolCalls = response.choices[0].message.tool_calls ?? [];
      const toolMessages: Groq.Chat.ChatCompletionMessageParam[] = [];

      for (const call of toolCalls) {
        const args = JSON.parse(call.function.arguments);
        // Dùng Groq search compound beta
        const searchResult = await groq.chat.completions.create({
          model: "compound-beta",
          messages: [
            {
              role: "user",
              content: `Tìm kiếm giá và thông tin sản phẩm cầu lông: ${args.query}. Chỉ trả về kết quả từ các shop Việt Nam như Shopee, Lazada, Tiki, các web cầu lông. Format: tên sản phẩm, giá, nguồn.`,
            },
          ],
          max_tokens: 500,
        });

        toolMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: searchResult.choices[0]?.message?.content ?? "Không tìm thấy kết quả",
        });
      }

      // Gọi lại Groq với kết quả search
      const finalResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: message },
          response.choices[0].message,
          ...toolMessages,
        ],
        max_tokens: 1000,
        temperature: 0.5,
      });
      finalContent = finalResponse.choices[0]?.message?.content ?? "";
    }

    // 6. Parse JSON từ AI
    let parsed = { answer: "", suggestedSlugs: [] as string[], competitors: [] as object[] };
    try {
      const jsonMatch = finalContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed.answer = finalContent;
      }
    } catch {
      parsed.answer = finalContent;
    }

    // 7. Lấy thông tin đầy đủ cho suggested products
    const suggestedProducts = parsed.suggestedSlugs?.length > 0
      ? await prisma.product.findMany({
          where: { slug: { in: parsed.suggestedSlugs } },
          select: { id: true, name: true, slug: true, price: true, thumbnail: true, brand: true },
        })
      : [];

    return NextResponse.json({
      answer: parsed.answer,
      suggestedProducts,
      competitors: parsed.competitors ?? [],
    });
  } catch (error) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json({ error: "AI hiện không khả dụng" }, { status: 500 });
  }
}