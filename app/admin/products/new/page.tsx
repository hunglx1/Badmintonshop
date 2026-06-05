"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    thumbnail: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res =
        await fetch("/api/categories");

      const data =
        await res.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  function createSlug(
    text: string
  ) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.name) {
      alert("Nhập tên sản phẩm");
      return;
    }

    if (!form.categoryId) {
      alert("Chọn danh mục");
      return;
    }

    if (!form.thumbnail) {
      alert(
        "Vui lòng upload ảnh sản phẩm"
      );
      return;
    }

    console.log(
      "FORM SUBMIT:",
      form
    );

    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/products",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...form,

            slug: createSlug(
              form.name
            ),
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "API RESPONSE:",
        data
      );

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Tạo sản phẩm thất bại"
        );
      }

      alert(
        "Tạo sản phẩm thành công"
      );

      router.push(
        "/admin/products"
      );
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          "Có lỗi xảy ra"
      );
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        ➕ Thêm sản phẩm mới
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-8
          space-y-6
        "
      >

        <div>

          <label className="font-semibold">
            Tên sản phẩm
          </label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              mt-2
            "
            placeholder="Ví dụ: Yonex Astrox 88D Pro"
          />

        </div>

        <div>

          <label className="font-semibold">
            Thương hiệu
          </label>

          <input
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              mt-2
            "
            placeholder="Yonex, Lining..."
          />

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-semibold">
              Giá bán
            </label>

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price:
                    e.target.value,
                })
              }
              className="
                w-full
                border
                p-3
                rounded-lg
                mt-2
              "
            />

          </div>

          <div>

            <label className="font-semibold">
              Tồn kho
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock:
                    e.target.value,
                })
              }
              className="
                w-full
                border
                p-3
                rounded-lg
                mt-2
              "
            />

          </div>

        </div>

        <div>

          <label className="font-semibold">
            Danh mục
          </label>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              mt-2
            "
          >
            <option value="">
              Chọn danh mục
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>

        </div>

        <div>

          <label className="font-semibold">
            Hình ảnh sản phẩm
          </label>

          <div className="mt-3">
            <ImageUpload
              onUploaded={(url) => {
                console.log(
                  "IMAGE URL:",
                  url
                );

                setForm(
                  (prev) => ({
                    ...prev,
                    thumbnail:
                      url,
                  })
                );
              }}
            />
          </div>

          {form.thumbnail && (
            <div className="mt-4">

              <p
                className="
                  text-sm
                  text-green-600
                  break-all
                  mb-3
                "
              >
                {form.thumbnail}
              </p>

              <img
                src={
                  form.thumbnail
                }
                alt="Preview"
                className="
                  w-52
                  h-52
                  object-cover
                  rounded-xl
                  border
                  shadow
                "
              />

            </div>
          )}

        </div>

        <div>

          <label className="font-semibold">
            Mô tả sản phẩm
          </label>

          <textarea
            rows={8}
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              mt-2
            "
            placeholder="Nhập mô tả sản phẩm..."
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-8
            py-3
            rounded-lg
            font-semibold
            disabled:opacity-50
          "
        >
          {loading
            ? "Đang lưu..."
            : "💾 Lưu sản phẩm"}
        </button>

      </form>

    </div>
  );
}