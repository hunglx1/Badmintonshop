import { prisma } from "@/lib/prisma";
import ProductAIChat from "@/components/ai/ProductAIChat";
interface Props {
  searchParams: Promise<{
    product?: string;
  }>;
}

export default async function AIPage({
  searchParams,
}: Props) {
  const { product } =
    await searchParams;

  let selectedProduct = null;

  if (product) {
    selectedProduct =
      await prisma.product.findUnique({
        where: {
          id: product,
        },
      });
  }

  return (
    <div className="max-w-6xl mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8">
          Chuyên gia Lee Hưng
      </h1>

      {selectedProduct && (
        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-6
            mb-8
          "
        >
          <h2 className="font-bold text-xl">
            Đang tư vấn:
          </h2>

          <p className="mt-2">
            {selectedProduct.name}
          </p>
        </div>
      )}

<div
  className="
    bg-white
    rounded-xl
    shadow
    p-6
  "
>
  {selectedProduct ? (
    <ProductAIChat
      productId={selectedProduct.id}
    />
  ) : (
    <div className="text-center py-10">
      <p className="text-gray-500">
        Chọn một sản phẩm để Hưng tư vấn.
      </p>
    </div>
  )}
</div>

    </div>
  );
}