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
            className="
              bg-white
              rounded-2xl
              shadow
              p-5
            "
          >

            <div className="flex justify-between">

              <div>

                <div className="font-bold">
                  {review.name}
                </div>

                <div className="text-yellow-500">
                  {"⭐".repeat(
                    review.rating
                  )}
                </div>

              </div>

              <div className="text-gray-400">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </div>

            </div>

            <p className="mt-3">
              {review.comment}
            </p>

          </div>

        ))}

      </div>

      <div
        className="
          bg-gray-50
          rounded-2xl
          p-6
          mt-8
        "
      >

        <h3 className="font-bold mb-4">
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
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-3
          "
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
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-3
          "
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
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        />

        <button
          onClick={
            submitReview
          }
          className="
            bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Gửi đánh giá
        </button>

      </div>

    </div>
  );
}