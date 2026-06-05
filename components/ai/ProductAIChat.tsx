"use client";

import { useState } from "react";

interface Props {
  productId: string;
}

export default function ProductAIChat({
  productId,
}: Props) {
  const [message, setMessage] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function askAI() {
    try {
      setError("");
      setAnswer("");
      setLoading(true);

      console.log("STEP 1: Button Click");

      const res = await fetch(
        "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId,
            message,
          }),
        }
      );

      console.log(
        "STEP 2: Fetch Done",
        res.status
      );

      const data =
        await res.json();

      console.log(
        "STEP 3: Data",
        data
      );

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Có lỗi xảy ra"
        );
      }

      setAnswer(data.answer);
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "AI Error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      <textarea
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        placeholder="
Hỏi AI về sản phẩm này...
"
        className="
          w-full
          border
          rounded-xl
          p-4
          min-h-[150px]
        "
      />

      <button
        onClick={askAI}
        disabled={
          loading || !message
        }
        className="
          bg-green-600
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        {loading
          ? "Đang hỏi AI..."
          : "🤖 Hỏi AI"}
      </button>

      {error && (
        <div
          className="
            bg-red-100
            text-red-600
            p-4
            rounded-xl
          "
        >
          {error}
        </div>
      )}

      {answer && (
        <div
          className="
            bg-gray-100
            p-5
            rounded-xl
            whitespace-pre-wrap
          "
        >
          {answer}
        </div>
      )}

    </div>
  );
}