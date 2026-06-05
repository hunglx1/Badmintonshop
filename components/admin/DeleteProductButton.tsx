"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm(
      `Bạn có chắc muốn xóa "${name}" không?`
    );

    if (!ok) return;

    const res = await fetch(
      `/api/admin/products/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.error || "Xóa thất bại"
      );
      return;
    }

    alert("Đã xóa sản phẩm");

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="
        bg-red-600
        hover:bg-red-700
        text-white
        px-3
        py-2
        rounded
      "
    >
      🗑 Xóa
    </button>
  );
}