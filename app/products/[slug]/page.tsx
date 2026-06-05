import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import AddToCartButton from "@/app/cart/AddToCartButton";
import ProductAIModal from "@/components/ai/ProductAIModal";
import ProductReviews from "@/components/products/ProductReviews";

interface Props {
params: Promise<{
slug: string;
}>;
}

export default async function ProductDetailPage({
params,
}: Props) {
const { slug } = await params;

const product =
await prisma.product.findUnique({
where: {
slug,
},


  include: {
    reviews: true,
    category: true,
    specifications: true,
  },
});


if (!product) {
notFound();
}

const relatedProducts =
await prisma.product.findMany({
where: {
categoryId:
product.categoryId,


    NOT: {
      id: product.id,
    },
  },

  take: 4,
});


return ( <div className="max-w-7xl mx-auto py-12 px-4">


  <div className="grid md:grid-cols-2 gap-12">

    {/* IMAGE */}

    <div>

      <div
        className="
          relative
          h-[600px]
          rounded-3xl
          overflow-hidden
          shadow-xl
        "
      >
      <Image
        src={product.thumbnail}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain"
      />
      </div>

    </div>

    {/* INFO */}

    <div>

      <p className="text-green-600 font-semibold">
        {product.brand}
      </p>

      <h1 className="text-5xl font-black mt-2">
        {product.name}
      </h1>

      <p className="text-gray-500 mt-3">
        {product.category.name}
      </p>

      <div className="mt-6">

        <span
          className="
            text-5xl
            font-black
            text-green-600
          "
        >
          {product.price.toLocaleString()}₫
        </span>

      </div>

      <div className="mt-5">

        <span
          className="
            bg-green-100
            text-green-700
            px-4
            py-2
            rounded-full
            font-medium
          "
        >
          Còn {product.stock} sản phẩm
        </span>

      </div>

      <div className="mt-8 space-y-4">

        <AddToCartButton
          product={product}
        />

        <ProductAIModal
          productId={product.id}
        />

        {/* AI CARD */}

        <div
          className="
            rounded-3xl
            p-6
            bg-gradient-to-r
            from-pink-500
            to-purple-600
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                text-4xl
              "
            >
              🏸
            </div>

            <div>

              <h3 className="text-2xl font-bold">
                Lee Hưng Badminton
              </h3>

              <p>
                Chuyên gia tư vấn cầu lông
              </p>

            </div>

          </div>

          <div
            className="
              mt-4
              text-sm
              text-white/90
            "
          >
            Hỏi Lee Hưng về sản phẩm này,
            so sánh với sản phẩm khác,
            chọn mức căng dây,
            chọn giày phù hợp...
          </div>

        </div>

      </div>

      <div className="mt-10">

        <h2
          className="
            text-2xl
            font-bold
            mb-4
          "
        >
          Mô tả sản phẩm
        </h2>

        <p
          className="
            text-gray-700
            leading-8
          "
        >
          {product.description}
        </p>

      </div>

    </div>

  </div>

  {/* SPECIFICATIONS */}

  {product.specifications.length > 0 && (

    <section className="mt-20">

      <h2 className="text-3xl font-bold mb-6">
        Thông số kỹ thuật
      </h2>

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          overflow-hidden
        "
      >

        <table className="w-full">

          <tbody>

            {product.specifications.map(
              (spec) => (
                <tr key={spec.id}>
                  <td
                    className="
                      border
                      p-4
                      bg-gray-50
                      font-semibold
                    "
                  >
                    {spec.key}
                  </td>

                  <td className="border p-4">
                    {spec.value}
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </section>

  )}

  {/* REVIEWS */}

  <ProductReviews
    productId={product.id}
    reviews={product.reviews}
  />

  {/* RELATED */}

  {relatedProducts.length > 0 && (

    <section className="mt-24">

      <h2 className="text-3xl font-bold mb-8">
        Sản phẩm liên quan
      </h2>

      <div
        className="
          grid
          md:grid-cols-4
          gap-6
        "
      >

        {relatedProducts.map(
          (item) => (

            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow
                hover:shadow-xl
                transition
              "
            >

              <div className="relative h-64">

                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-4">

                <h3 className="font-bold">
                  {item.name}
                </h3>

                <div
                  className="
                    mt-2
                    text-green-600
                    font-bold
                  "
                >
                  {item.price.toLocaleString()}₫
                </div>

              </div>

            </Link>

          )
        )}

      </div>

    </section>

  )}

</div>


);
}
