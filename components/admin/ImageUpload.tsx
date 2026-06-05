"use client";

import { useState } from "react";

interface Props {
  onUploaded: (url: string) => void;
}

export default function ImageUpload({
  onUploaded,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESULT:", data);

      if (!res.ok) {
        alert(data.error || "Upload thất bại");
        return;
      }

      onUploaded(data.url);

      alert("Upload ảnh thành công");
    } catch (error) {
      console.error(error);

      alert("Upload thất bại");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {loading && (
        <p className="text-blue-600">
          Đang upload ảnh...
        </p>
      )}
    </div>
  );
}