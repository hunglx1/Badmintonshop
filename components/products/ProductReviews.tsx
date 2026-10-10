"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface Props {
  productId: string;
  reviews: Review[];
}

export default function ProductReviews({ productId, reviews }: Props) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Vui lòng nhập tên và nhận xét của bạn");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Cảm ơn bạn đã gửi đánh giá!", {
          description: "Nhận xét của bạn đã được ghi nhận.",
        });
        setName("");
        setComment("");
        setRating(5);
        setTimeout(() => location.reload(), 1200);
      } else {
        toast.error("Gửi đánh giá không thành công, vui lòng thử lại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-red-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Đánh Giá Của Khách Hàng
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Trải nghiệm thực tế từ các vận động viên và người chơi cầu lông.
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 self-start sm:self-auto">
          <div className="flex items-center text-amber-500">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 leading-none">{avgRating}</span>
            <span className="text-xs text-slate-400 block font-normal">/ 5.0 ({reviews.length} đánh giá)</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition hover:bg-white hover:border-slate-200 hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3 w-3 ${
                              idx < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200 fill-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
              <p className="text-sm">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-xs text-slate-400 mt-1">Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
            </div>
          )}
        </div>

        {/* Write a review form */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 self-start">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Gửi đánh giá của bạn
          </h3>

          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Mức độ hài lòng
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                    title={`${star} sao`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {rating} / 5 sao
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Nhận xét & Trải nghiệm
              </label>
              <textarea
                placeholder="Cảm giác đánh, độ bền, lực smash, độ êm khi di chuyển..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 outline-none focus:border-red-600 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-red-700 disabled:bg-slate-300"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{loading ? "Đang gửi..." : "Gửi đánh giá"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}