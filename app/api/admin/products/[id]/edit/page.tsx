import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage(
  { params }: Props
) {
  const { id } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        id,
      },
    });

  if (!product) {
    return (
      <div>
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Sửa sản phẩm
      </h1>

      <pre>
        {JSON.stringify(
          product,
          null,
          2
        )}
      </pre>

    </div>
  );
}