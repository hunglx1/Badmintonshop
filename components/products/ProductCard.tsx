import Link from "next/link";

export default function ProductCard({
  name,
  slug,
  thumbnail,
  price,
  brand,
}: any) {
  return (
    <Link href={`/products/${slug}`}>

      <div className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition">

        <div className="overflow-hidden">

          <img
            src={thumbnail}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-105 transition"
          />

        </div>

        <div className="p-4">

          <p className="text-sm text-gray-500">
            {brand}
          </p>

          <h3 className="font-semibold mt-2">
            {name}
          </h3>

          <p className="text-red-600 text-xl font-bold mt-3">

            {price.toLocaleString()}₫

          </p>

        </div>

      </div>

    </Link>
  );
}