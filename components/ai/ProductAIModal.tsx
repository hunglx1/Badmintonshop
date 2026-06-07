"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

interface Props {
  productId: string;
  productName?: string;
}

interface SuggestedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
  brand: string;
}

interface Competitor {
  name: string;
  brand: string;
  price: string;
  source: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: SuggestedProduct[];
  competitors?: Competitor[];
}

const SUGGESTIONS = [
  "So sánh với sản phẩm khác cùng loại",
  "So sánh giá với đối thủ trên thị trường",
  "Sản phẩm này phù hợp với ai?",
  "Người mới chơi dùng được không?",
  "Có nên căng 28lbs không?",
  "Gợi ý sản phẩm phù hợp cho tôi",
];

// Render markdown đơn giản (bold, bullet)
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bullet points
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.slice(2);
      return (
        <li key={i} className="ml-3 list-disc text-sm text-slate-900">
          {renderInline(content)}
        </li>
      );
    }
    // Empty line
    if (line.trim() === "") return <br key={i} />;
    // Normal line
    return <p key={i} className="text-sm text-slate-900">{renderInline(line)}</p>;
  });
}

function renderInline(text: string) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ProductAIModal({ productId, productName }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Xin chào 👋 Tôi là tư vấn viên của Hưng Badminton!\n\nTôi có thể giúp bạn:\n• So sánh sản phẩm này với các sản phẩm khác\n• So sánh giá với đối thủ trên thị trường\n• Gợi ý sản phẩm phù hợp với bạn\n• Tư vấn thông số kỹ thuật\n\nHãy đặt câu hỏi nhé! 🏸`,
    },
  ]);

  const cartItems = useCartStore((state) => state.items);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage(question?: string) {
    const text = (question || input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          message: text,
          history: messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
          cartItems: cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Xin lỗi, hiện tôi chưa thể trả lời.",
          suggestedProducts: data.suggestedProducts ?? [],
          competitors: data.competitors ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." },
      ]);
    }

    setLoading(false);
  }

  const messageCount = messages.length - 1;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span>💬</span>
        <span>Tư vấn miễn phí</span>
        {messageCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {messageCount}
          </span>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[720px] sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="border-b px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/staff.jpg"
                    alt="Tư vấn viên"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Hưng Badminton</h3>
                  <p className="text-xs text-green-600 font-medium">● Đang hoạt động</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messageCount > 0 && (
                  <button
                    onClick={() => setMessages([messages[0]])}
                    className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    Chat mới
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cart banner */}
            {cartItems.length > 0 && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 shrink-0">
                <p className="text-xs text-amber-700">
                  🛒 Hưng đang xem giỏ hàng ({cartItems.length} sản phẩm) để tư vấn tốt hơn
                </p>
              </div>
            )}

            {/* Suggestions khi mới mở */}
            {messageCount === 0 && (
              <div className="px-4 py-3 border-b bg-gray-50 shrink-0">
                <p className="text-xs text-gray-500 mb-2 font-medium">Câu hỏi gợi ý:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      onClick={() => sendMessage(item)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <img
                      src="/staff.jpg"
                      alt="Tư vấn viên"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                    />
                  )}

                  <div className="max-w-[85%] space-y-3">
                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-sm text-sm"
                          : "bg-white text-slate-900 shadow-sm border border-gray-100 rounded-bl-sm space-y-1"
                      }`}
                    >
                      {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                    </div>

                    {/* Suggested product cards */}
                    {msg.role === "assistant" && msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium pl-1">📦 Sản phẩm gợi ý:</p>
                        {msg.suggestedProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-md transition-all group"
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={p.thumbnail}
                                alt={p.name}
                                fill
                                sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.brand}</p>
                              <p className="text-sm font-bold text-blue-600 mt-0.5">
                                {p.price.toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                            <span className="text-blue-500 text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Competitor comparison table */}
                    {msg.role === "assistant" && msg.competitors && msg.competitors.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                          <p className="text-xs font-semibold text-gray-700">🔍 So sánh giá thị trường (realtime)</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {msg.competitors.map((c, i) => (
                            <div key={i} className="flex items-center justify-between px-4 py-3">
                              <div>
                                <p className="text-xs font-medium text-gray-800 leading-tight">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.brand} · {c.source}</p>
                              </div>
                              <p className="text-sm font-bold text-orange-500 shrink-0 ml-3">{c.price}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                          <p className="text-xs text-gray-400">* Giá tham khảo, có thể thay đổi theo thời gian</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-2">
                <img
                  src="/staff.jpg"
                  alt="Tư vấn viên"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                  <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white shrink-0">
              {messageCount > 0 && messageCount < 3 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                  {["So sánh giá đối thủ", "Gợi ý sản phẩm phù hợp", "Có nên mua không?"].map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Nhập câu hỏi..."
                  disabled={loading}
                  className="flex-1 border border-gray-200 rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
                >
                  Gửi
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Giá đối thủ được tìm kiếm realtime · Có thể có sai sót
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
