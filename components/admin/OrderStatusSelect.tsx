"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  async function updateStatus(
    status: string
  ) {
    const response = await fetch(
      `/api/admin/orders/${orderId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error || "Cập nhật trạng thái thất bại");
      return;
    }

    toast.success("Đã cập nhật trạng thái đơn hàng");
    router.refresh();
  }

  const transitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };
  const options = [currentStatus, ...(transitions[currentStatus] ?? [])];

  return (
    <select
      value={currentStatus}
      onChange={(e) =>
        updateStatus(e.target.value)
      }
      className="
        border
        rounded
        p-2
      "
    >
      {options.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}