"use client";

import { useRouter } from "next/navigation";

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
    await fetch(
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

    router.refresh();
  }

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
      <option value="PENDING">
        PENDING
      </option>

      <option value="CONFIRMED">
        CONFIRMED
      </option>

      <option value="SHIPPING">
        SHIPPING
      </option>

      <option value="COMPLETED">
        COMPLETED
      </option>

      <option value="CANCELLED">
        CANCELLED
      </option>
    </select>
  );
}