"use client";

import { useState } from "react";

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

export default function ProductReviews({
  productId,
  reviews,
}: Props) {
  const [name, setName] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  async function submitReview() {
    const res = await fetch(
      `/api/products/${productId}/reviews`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          rating,
          comment,
        }),
      }
    );

    if (res.ok) {
      alert(
        "Cảm ơn bạn đã đánh giá"
      );

      location.reload();
    }
  }

  return (
    <div className="mt-16">

      <h2 className="text-3xl font-bold mb-8">
        ⭐ Đánh giá khách hàng
      </h2>

      <div className="space-y-4">

        {reviews.map((review) => (

          <div
            key={review.id}
            className="rounded-3xl border border-slate-700 bg-[#111827]/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="font-bold text-slate-100">
                  {review.name}
                </div>

                <div className="mt-2 text-amber-400">
                  {"⭐".repeat(
                    review.rating
                  )}
                </div>

              </div>

              <div className="text-sm text-slate-500">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </div>

            </div>

            <p className="mt-4 text-slate-300 leading-7">
              {review.comment}
            </p>

          </div>

        ))}

      </div>

      <div className="rounded-3xl border border-slate-700 bg-[#0B1220]/95 p-6 mt-8 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">

        <h3 className="mb-4 text-xl font-semibold text-slate-100">
          Viết đánh giá
        </h3>

        <input
          placeholder="Tên của bạn"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 mb-3"
        />

        <select
          value={rating}
          onChange={(e) =>
            setRating(
              Number(
                e.target.value
              )
            )
          }
          className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 mb-3"
        >
          <option value="5">
            ⭐⭐⭐⭐⭐
          </option>

          <option value="4">
            ⭐⭐⭐⭐
          </option>

          <option value="3">
            ⭐⭐⭐
          </option>

          <option value="2">
            ⭐⭐
          </option>

          <option value="1">
            ⭐
          </option>
        </select>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Nhận xét..."
          className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 mb-4 min-h-[140px]"
        />

        <button
          onClick={
            submitReview
          }
          className="inline-flex items-center justify-center rounded-3xl bg-[#CCFF00] px-6 py-3 font-semibold text-slate-950 transition hover:bg-[#daff00]/90"
        >
          Gửi đánh giá
        </button>

      </div>

    </div>
  );
}