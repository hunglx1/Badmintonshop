"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await fetch(
      "/api/categories",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          slug,
        }),
      }
    );

    router.push(
      "/admin/categories"
    );
  }

  return (
    <div className="max-w-xl p-8">

      <h1 className="text-3xl font-bold mb-8">
        Thêm danh mục
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="
            border
            p-3
            rounded
            w-full
          "
        />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value
            )
          }
          className="
            border
            p-3
            rounded
            w-full
          "
        />

        <button
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
        >
          Lưu
        </button>

      </form>

    </div>
  );
}