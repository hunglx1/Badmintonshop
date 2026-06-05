import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="bg-gray-50">

      {/* HERO */}

      <section className="relative min-h-[90vh] overflow-hidden">

        <Image
          src="/hero.jpg"
          alt="Badminton"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">

          <div
            className="
              max-w-7xl
              mx-auto
              px-4
              min-h-[90vh]
              flex
              items-center
            "
          >

            <div className="max-w-3xl text-white">

              <span
                className="
                  bg-green-500/20
                  text-green-300
                  px-5 py-2
                  rounded-full
                  text-sm
                "
              >
                🏸 Shop cầu lông chính hãng
              </span>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  font-black
                  leading-tight
                  mt-6
                "
              >
                Nâng Tầm
                <br />
                Trận Đấu Của Bạn
              </h1>

              <p
                className="
                  mt-6
                  text-lg
                  text-gray-300
                "
              >
                Chuyên vợt cầu lông, giày,
                túi, phụ kiện chính hãng từ
                Yonex, Victor, Lining, Mizuno.
              </p>

              <div className="flex gap-4 mt-10">

                <Link
                  href="/products"
                  className="
                    bg-green-600
                    hover:bg-green-700
                    px-8 py-4
                    rounded-xl
                    font-bold
                  "
                >
                  Mua ngay
                </Link>

                <Link
                  href="/products"
                  className="
                    border
                    border-white
                    px-8 py-4
                    rounded-xl
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  Xem sản phẩm
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* BRANDS */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4">

          <h2
            className="
              text-4xl
              font-bold
              text-center
              mb-12
            "
          >
            Thương Hiệu Hàng Đầu
          </h2>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-5
              gap-6
            "
          >

            {[
              "Yonex",
              "Victor",
              "Lining",
              "Mizuno",
              "Apacs",
            ].map((brand) => (
              <div
                key={brand}
                className="
                  bg-white
                  border
                  rounded-2xl
                  h-32
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-2
                  transition
                "
              >
                <span
                  className="
                    text-xl
                    font-bold
                  "
                >
                  {brand}
                </span>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div
            className="
              flex
              justify-between
              items-center
              mb-10
            "
          >

            <h2
              className="
                text-4xl
                font-bold
              "
            >
              Sản Phẩm Mới Nhất
            </h2>

            <Link
              href="/products"
              className="
                text-green-600
                font-semibold
              "
            >
              Xem tất cả →
            </Link>

          </div>

          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
            "
          >

            {products.map((product) => (

              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="
                  group
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-2xl
                  transition-all
                "
              >

                <div
                  className="
                    relative
                    h-72
                    overflow-hidden
                  "
                >
                  
<img
  src={product.thumbnail}
  alt={product.name}
  className="
    w-full
    h-full
    object-cover
    group-hover:scale-110
    transition
    duration-500
  "
/>

                  <span
                    className="
                      absolute
                      top-4
                      left-4
                      bg-red-500
                      text-white
                      text-sm
                      px-3
                      py-1
                      rounded-full
                    "
                  >
                    HOT
                  </span>

                </div>

                <div className="p-5">

                  <h3
                    className="
                      font-bold
                      text-lg
                      line-clamp-2
                    "
                  >
                    {product.name}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {product.brand}
                  </p>

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      mt-5
                    "
                  >

                    <span
                      className="
                        text-2xl
                        font-bold
                        text-green-600
                      "
                    >
                      {product.price.toLocaleString()}
                      ₫
                    </span>

                    <span
                      className="
                        bg-green-600
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Xem
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* SALE BANNER */}

      <section
        className="
          bg-gradient-to-r
          from-green-600
          to-green-800
          text-white
          py-20
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            text-center
          "
        >

          <h2
            className="
              text-5xl
              font-black
            "
          >
            🔥 Giảm Giá Đến 40%
          </h2>

          <p className="mt-4 text-xl">
            Miễn phí đan vợt và giao hàng
            toàn quốc
          </p>

        </div>

      </section>

      {/* AI SECTION */}

      <section className="py-24 bg-white">

        <div
          className="
            max-w-5xl
            mx-auto
            px-4
          "
        >

          <div
            className="
              rounded-3xl
              bg-gradient-to-r
              from-green-600
              to-green-700
              text-white
              p-12
              text-center
            "
          >

            <h2
              className="
                text-5xl
                font-black
              "
            >
               Chuyên Gia Cầu Lông
            </h2>

            <p
              className="
                mt-4
                text-xl
              "
            >
              Tư vấn vợt, giày và phụ kiện
              phù hợp với trình độ và
              ngân sách của bạn.
            </p>

            <button
              className="
                mt-8
                bg-white
                text-green-700
                px-8
                py-4
                rounded-xl
                font-bold
              "
            >
              Bắt đầu tư vấn
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}