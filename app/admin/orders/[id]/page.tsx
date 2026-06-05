import { prisma } from "@/lib/prisma";
import OrderStatusSelect
from "@/components/admin/OrderStatusSelect";
interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetail(
  { params }: Props
) {
  const { id } = await params;

  const order =
    await prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

  if (!order) {
    return (
      <div>
        Không tìm thấy đơn
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Chi tiết đơn hàng
      </h1>

      <div className="space-y-2">

        <p>
          Khách:
          {" "}
          {order.customerName}
        </p>

        <p>
          SĐT:
          {" "}
          {order.phone}
        </p>

        <p>
          Địa chỉ:
          {" "}
          {order.address}
        </p>

        <div className="mt-4">
        <p className="mb-2 font-semibold">
            Trạng thái đơn hàng
        </p>

        <OrderStatusSelect
            orderId={order.id}
            currentStatus={order.status}
        />
        </div>

      </div>

      <div className="mt-8">

        <h2 className="font-bold text-xl mb-4">
          Sản phẩm
        </h2>

        {order.items.map(
          (item) => (
            <div
              key={item.id}
              className="
                border
                p-4
                rounded
                mb-2
              "
            >
              <p>
                {
                  item.product
                    .name
                }
              </p>

              <p>
                SL:
                {" "}
                {item.quantity}
              </p>

              <p>
                Giá:
                {" "}
                {item.price.toLocaleString()}
                ₫
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}