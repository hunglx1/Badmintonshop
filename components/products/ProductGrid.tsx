import ProductCard from "./ProductCard";

interface Review {
  rating: number;
}

interface Category {
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  stock: number;
  thumbnail: string;
  description: string;
  category?: Category;
  reviews?: Review[];
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-24">
        <span className="text-5xl">🏸</span>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Không tìm thấy sản phẩm
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
