"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProductForm {
  name: string;
  slug: string;
  brand: string;
  price: string;
  stock: string;
  thumbnail: string;
  description: string;
  categoryId: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<ProductForm>({
      name: "",
      slug: "",
      brand: "",
      price: "",
      stock: "",
      thumbnail: "",
      description: "",
      categoryId: "",
    });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/products/${id}/detail`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Không tải được sản phẩm"
        );
      }

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        brand: data.brand ?? "",
        price:
          data.price?.toString() ??
          "",
        stock:
          data.stock?.toString() ??
          "",
        thumbnail:
          data.thumbnail ?? "",
        description:
          data.description ?? "",
        categoryId:
          data.categoryId ?? "",
      });
    } catch (error: any) {
      alert(
        error.message ||
          "Có lỗi xảy ra"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            form
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Cập nhật thất bại"
        );
      }

      alert(
        "Cập nhật sản phẩm thành công"
      );

      router.push(
        "/admin/products"
      );
    } catch (error: any) {
      alert(
        error.message ||
          "Có lỗi xảy ra"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-semibold">
          Đang tải sản phẩm...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          ✏️ Sửa sản phẩm
        </h1>

        <p className="text-gray-500 mt-2">
          Chỉnh sửa thông tin sản phẩm
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-2xl p-6 space-y-5"
      >
        {/* Ảnh hiện tại */}
        {form.thumbnail && (
          <div>
            <label className="font-medium block mb-3">
              Ảnh hiện tại
            </label>

            <img
              src={form.thumbnail}
              alt={form.name}
              className="
                w-48
                h-48
                object-cover
                rounded-xl
                border
              "
            />
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">
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
              rounded-lg
              p-3
            "
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Slug
          </label>

          <input
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              rounded-lg
              p-3
            "
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
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
              rounded-lg
              p-3
            "
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Giá
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
                rounded-lg
                p-3
              "
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
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
                rounded-lg
                p-3
              "
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Ảnh sản phẩm
          </label>

          <input
            value={form.thumbnail}
            onChange={(e) =>
              setForm({
                ...form,
                thumbnail:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              rounded-lg
              p-3
            "
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Category ID
          </label>

          <input
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
              rounded-lg
              p-3
            "
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
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
              rounded-lg
              p-3
            "
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            {saving
              ? "Đang lưu..."
              : "💾 Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            className="
              border
              px-6
              py-3
              rounded-lg
            "
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}