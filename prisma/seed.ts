import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// KIỂU DỮ LIỆU
// ─────────────────────────────────────────────
interface Spec {
  key: string;
  value: string;
}

interface ProductData {
  name: string;
  slug: string;
  brand: string;
  price: number;
  stock: number;
  thumbnail: string;
  description: string;
  categorySlug: string;
  specs: Spec[];
}

// ─────────────────────────────────────────────
// 100 SẢN PHẨM CỐ ĐỊNH
// ─────────────────────────────────────────────
const products: ProductData[] = [
  // ══════════════════════════════════════════
  // VỢT CẦU LÔNG (30 sản phẩm)
  // ══════════════════════════════════════════
  {
    name: "Yonex Astrox 88D Pro",
    slug: "yonex-astrox-88d-pro",
    brand: "Yonex",
    price: 4200000,
    stock: 15,
    thumbnail: "/products/astrox88dpro.jpg",
    description:
      "Yonex Astrox 88D Pro là vợt tấn công chuyên nghiệp dành cho tay đánh đơn. Công nghệ Rotational Generator System tạo lực đánh xuyên phá mạnh mẽ. Khung vợt làm từ HM Graphite + Fullerene kết hợp Tungsten, giúp đầu vợt nặng hơn nhưng kiểm soát tốt hơn. Điểm ngọt lớn, lực smash ấn tượng. Phù hợp cho vận động viên cấp độ bán chuyên đến chuyên nghiệp.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "305mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "HM Graphite + Fullerene + Tungsten" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Yonex Astrox 100ZZ",
    slug: "yonex-astrox-100zz",
    brand: "Yonex",
    price: 6500000,
    stock: 8,
    thumbnail: "/products/astrox100zz.jpg",
    description:
      "Yonex Astrox 100ZZ là vợt flagship cao cấp nhất dòng Astrox. Được thiết kế dành cho những tay vợt chuyên nghiệp ưa thích lối chơi tấn công mạnh. Công nghệ Namd giúp thân vợt uốn cong và phục hồi siêu nhanh, tạo lực smash cực mạnh. Màu sắc Kurenai (đỏ đen) nổi bật, được nhiều vận động viên quốc tế tin dùng.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "310mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Extra Stiff" },
      { key: "Chất liệu", value: "HM Graphite + Namd + Tungsten" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tấn công mạnh" },
    ],
  },
  {
    name: "Yonex Astrox 99 Pro",
    slug: "yonex-astrox-99-pro",
    brand: "Yonex",
    price: 4500000,
    stock: 10,
    thumbnail: "/products/astrox99pro.jpg",
    description:
      "Yonex Astrox 99 Pro kế thừa ADN từ Astrox 99 huyền thoại, nâng cấp với công nghệ Energy Boost Cap Plus giúp lực smash nhanh hơn và sắc hơn. Khung vợt ISOMETRIC tạo vùng ngọt lớn hơn 7% so với khung tròn truyền thống. Thân vợt cứng giúp phát lực tối đa trong từng cú đánh.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "308mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "HM Graphite + Tungsten" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Yonex Astrox 77 Pro",
    slug: "yonex-astrox-77-pro",
    brand: "Yonex",
    price: 3800000,
    stock: 12,
    thumbnail: "/products/astrox77pro.jpg",
    description:
      "Yonex Astrox 77 Pro là vợt cân bằng thiên tấn công, phù hợp cho tay đôi và tay đơn. Thích hợp với người chơi thích tấn công toàn diện nhưng vẫn cần khả năng phòng thủ linh hoạt. Công nghệ Rotational Generator System giúp tăng tốc độ swing, tạo lực đánh ổn định.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "295mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "HM Graphite + Nanometric" },
      { key: "Lực căng tối đa", value: "27 lbs" },
      { key: "Phong cách", value: "Cân bằng – Tấn công" },
    ],
  },
  {
    name: "Yonex Astrox 22 RX",
    slug: "yonex-astrox-22-rx",
    brand: "Yonex",
    price: 1650000,
    stock: 20,
    thumbnail: "/products/astrox22rx.jpg",
    description:
      "Yonex Astrox 22 RX là vợt tầm trung phù hợp cho người chơi phong trào muốn nâng cao kỹ năng. Thiết kế đầu nặng giúp tạo lực smash tốt. Dễ làm quen, bền bỉ, giá hợp lý. Lý tưởng cho người mới bắt đầu muốn trải nghiệm cảm giác vợt đầu nặng của dòng Astrox.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "295mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "Graphite" },
      { key: "Lực căng tối đa", value: "26 lbs" },
      { key: "Phong cách", value: "Tấn công – Phong trào" },
    ],
  },
  {
    name: "Yonex Arcsaber 11 Pro",
    slug: "yonex-arcsaber-11-pro",
    brand: "Yonex",
    price: 4800000,
    stock: 9,
    thumbnail: "/products/arcsaber11pro.jpg",
    description:
      "Yonex Arcsaber 11 Pro là đỉnh cao của dòng vợt kiểm soát Arcsaber. Công nghệ Flex Force cải tiến giúp thân vợt tích năng lượng tối đa, trả lực chính xác theo ý người chơi. Điểm cân bằng trung lập cho phép chơi đa năng, từ lobs, drops đến smash kỹ thuật. Lựa chọn ưa thích của các tay vợt đơn chuyên sâu.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "285mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "HM Graphite + Nanometric DR" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Kiểm soát – Kỹ thuật" },
    ],
  },
  {
    name: "Yonex Arcsaber 7 Pro",
    slug: "yonex-arcsaber-7-pro",
    brand: "Yonex",
    price: 3200000,
    stock: 14,
    thumbnail: "/products/arcsaber7pro.jpg",
    description:
      "Yonex Arcsaber 7 Pro phù hợp cho người chơi ưa thích kiểm soát cầu. Thân vợt linh hoạt hấp thụ lực tốt, trả cầu nhẹ nhàng và chính xác. Thích hợp cho tay đôi cần tốc độ trao đổi nhanh ở lưới. Bộ khung ISOMETRIC tạo vùng sweet spot rộng hơn.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "280mm (Cán nặng)" },
      { key: "Độ cứng", value: "Flexible" },
      { key: "Chất liệu", value: "HM Graphite + Nanometric" },
      { key: "Lực căng tối đa", value: "27 lbs" },
      { key: "Phong cách", value: "Kiểm soát – Tốc độ" },
    ],
  },
  {
    name: "Yonex Arcsaber Z-Slash",
    slug: "yonex-arcsaber-z-slash",
    brand: "Yonex",
    price: 2800000,
    stock: 11,
    thumbnail: "/products/arcsaberzslash.jpg",
    description:
      "Yonex Arcsaber Z-Slash kết hợp giữa tốc độ và kiểm soát. Thiết kế aerodynamic giúp swing nhanh hơn trong không khí. Phù hợp cho người chơi thích lối đánh phụ thuộc vào tốc độ cổ tay hơn là sức mạnh cơ thể.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "3U (85–89g)" },
      { key: "Điểm cân bằng", value: "288mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "HM Graphite" },
      { key: "Lực căng tối đa", value: "27 lbs" },
      { key: "Phong cách", value: "Tốc độ – Kiểm soát" },
    ],
  },
  {
    name: "Yonex Nanoflare 1000Z",
    slug: "yonex-nanoflare-1000z",
    brand: "Yonex",
    price: 6200000,
    stock: 6,
    thumbnail: "/products/nanoflare1000z.jpg",
    description:
      "Yonex Nanoflare 1000Z là vợt tốc độ đỉnh cao trong dòng Nanoflare. Công nghệ Sonic Metal giúp khung vợt cứng hơn ở đầu và linh hoạt hơn ở thân, tối ưu tốc độ phát lực. Lý tưởng cho người chơi đánh nhanh, cắt cầu, và phòng thủ tốc độ cao. Được nhiều tay vợt đôi nam quốc tế lựa chọn.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "285mm (Cán nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "HM Graphite + Sonic Metal + Nanometric" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tốc độ – Phòng thủ" },
    ],
  },
  {
    name: "Yonex Nanoflare 800 Pro",
    slug: "yonex-nanoflare-800-pro",
    brand: "Yonex",
    price: 3500000,
    stock: 13,
    thumbnail: "/products/nanoflare800pro.jpg",
    description:
      "Yonex Nanoflare 800 Pro là vợt tốc độ cho tay đôi, có cán nhẹ hơn giúp phản ứng nhanh ở lưới. Phù hợp cho người chơi ưa thích tốc độ và cần vợt linh hoạt trong các pha đánh trao đổi. Khung ISOMETRIC mở rộng sweet spot.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "283mm (Cán nặng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "HM Graphite + Nanometric" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tốc độ" },
    ],
  },
  {
    name: "Victor Thruster Ryuga Metallic",
    slug: "victor-thruster-ryuga-metallic",
    brand: "Victor",
    price: 5500000,
    stock: 7,
    thumbnail: "/products/ryugametallic.jpg",
    description:
      "Victor Thruster Ryuga Metallic là phiên bản đặc biệt của dòng Ryuga huyền thoại. Màu metallic sang trọng, kết hợp công nghệ sợi carbon nano cao cấp. Vợt đầu nặng, thân cứng, tối ưu cho cú smash uy lực. Được thiết kế cho vận động viên chuyên nghiệp ưa thích lối đánh tấn công.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "305mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "High Resilience Modulus Graphite + Nano Fortify TR" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tấn công mạnh" },
    ],
  },
  {
    name: "Victor Thruster Ryuga 2 Pro",
    slug: "victor-thruster-ryuga-2-pro",
    brand: "Victor",
    price: 4900000,
    stock: 9,
    thumbnail: "/products/ryuga2pro.jpg",
    description:
      "Victor Thruster Ryuga 2 Pro nâng cấp so với thế hệ đầu với khung vợt cải tiến, tăng cường độ cứng ở góc T và giảm rung động. Công nghệ PYROFIL Carbon mang lại cảm giác đánh chắc chắn, smash sâu và xuyên phá. Phù hợp tay đơn chuyên nghiệp.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "308mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Extra Stiff" },
      { key: "Chất liệu", value: "PYROFIL Carbon + Nano Fortify TR" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Victor Thruster F",
    slug: "victor-thruster-f",
    brand: "Victor",
    price: 2600000,
    stock: 18,
    thumbnail: "/products/thrusterf.jpg",
    description:
      "Victor Thruster F là vợt phổ thông của dòng Thruster, phù hợp người chơi phong trào muốn trải nghiệm cảm giác đầu nặng. Giá hợp lý, bền bỉ, là lựa chọn tốt cho người mới học chuyển từ vợt nhôm sang vợt carbon.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "298mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "Graphite" },
      { key: "Lực căng tối đa", value: "25 lbs" },
      { key: "Phong cách", value: "Tấn công – Phong trào" },
    ],
  },
  {
    name: "Victor Thruster K Falcon",
    slug: "victor-thruster-k-falcon",
    brand: "Victor",
    price: 3400000,
    stock: 12,
    thumbnail: "/products/thrusterkfalcon.jpg",
    description:
      "Victor Thruster K Falcon được phát triển với công nghệ KINETEC, tối ưu luồng khí qua khung vợt khi swing giúp tốc độ đầu vợt tăng đáng kể. Vợt đầu nặng, thích hợp cho người chơi tấn công có kinh nghiệm ở cấp độ bán chuyên.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "302mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "High Resilience Graphite + KINETEC" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Victor Thruster K9900",
    slug: "victor-thruster-k9900",
    brand: "Victor",
    price: 3900000,
    stock: 10,
    thumbnail: "/products/thrusterk9900.jpg",
    description:
      "Victor Thruster K9900 là vợt tầm cao cho tay đơn tấn công. Khung vợt cứng kết hợp đầu nặng cho phép cú smash mạnh và chính xác. Phù hợp người chơi trình độ khá đến chuyên nghiệp muốn dominate từ cuối sân.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "306mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "High Resilience Modulus Graphite" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Victor Auraspeed 90K",
    slug: "victor-auraspeed-90k",
    brand: "Victor",
    price: 4600000,
    stock: 8,
    thumbnail: "/products/auraspeed90k.jpg",
    description:
      "Victor Auraspeed 90K là vợt tốc độ hàng đầu của Victor, dành cho tay đôi chuyên nghiệp. Công nghệ PYROFIL + Aero-Sword Frame giúp cắt gió tối ưu, tốc độ swing đạt đỉnh điểm. Cán nhẹ giúp phản xạ lưới nhanh, thích hợp đánh chéo sân và lob phòng thủ.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "280mm (Cán nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "PYROFIL Carbon + Aero-Sword" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tốc độ – Tay đôi" },
    ],
  },
  {
    name: "Victor Auraspeed 100X",
    slug: "victor-auraspeed-100x",
    brand: "Victor",
    price: 5200000,
    stock: 6,
    thumbnail: "/products/auraspeed100x.jpg",
    description:
      "Victor Auraspeed 100X là phiên bản cao cấp nhất dòng Auraspeed, kết hợp tốc độ và kiểm soát. Thiết kế khung dẹt Aero-Sword cắt gió tối ưu. Phù hợp cho vận động viên chuyên nghiệp thi đấu đôi nam, hỗn hợp cần tốc độ cao nhất.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "278mm (Cán nặng)" },
      { key: "Độ cứng", value: "Extra Stiff" },
      { key: "Chất liệu", value: "PYROFIL Carbon + Nano Fortify TR" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tốc độ cao" },
    ],
  },
  {
    name: "Victor Auraspeed HS Plus",
    slug: "victor-auraspeed-hs-plus",
    brand: "Victor",
    price: 2900000,
    stock: 15,
    thumbnail: "/products/auraspeedhsplus.jpg",
    description:
      "Victor Auraspeed HS Plus là vợt tầm trung của dòng Auraspeed, phù hợp người chơi phong trào đến bán chuyên muốn tốc độ swing cao. Nhẹ, linh hoạt, dễ dàng kiểm soát ở lưới và phòng thủ nhanh.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "5U (75–79g)" },
      { key: "Điểm cân bằng", value: "282mm (Cán nặng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "Graphite + Resin" },
      { key: "Lực căng tối đa", value: "26 lbs" },
      { key: "Phong cách", value: "Tốc độ – Phong trào" },
    ],
  },
  {
    name: "Lining DriveX 10",
    slug: "lining-drivex-10",
    brand: "Lining",
    price: 3800000,
    stock: 11,
    thumbnail: "/products/drivex10.jpg",
    description:
      "Lining DriveX 10 là vợt tấn công cao cấp của Li-Ning, được sản xuất từ sợi carbon Toray T900. Thiết kế khung D.F. System tối ưu độ cứng tại điểm tiếp xúc, tăng lực truyền smash. Phù hợp tay đơn chuyên nghiệp ưa thích lối đánh uy lực.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "302mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "Toray T900 Carbon + W.D.F" },
      { key: "Lực căng tối đa", value: "30 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Lining DriveX 9X",
    slug: "lining-drivex-9x",
    brand: "Lining",
    price: 2400000,
    stock: 16,
    thumbnail: "/products/drivex9x.jpg",
    description:
      "Lining DriveX 9X là vợt tầm trung phù hợp cho người chơi phong trào đến bán chuyên. Cứng vừa phải, cân bằng tốt, dễ kiểm soát. Thích hợp cho người chơi toàn diện muốn vợt đa năng.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "290mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "High Modulus Graphite" },
      { key: "Lực căng tối đa", value: "27 lbs" },
      { key: "Phong cách", value: "Cân bằng" },
    ],
  },
  {
    name: "Lining Axforce 90 Dragon",
    slug: "lining-axforce-90-dragon",
    brand: "Lining",
    price: 5800000,
    stock: 5,
    thumbnail: "/products/axforce90dragon.jpg",
    description:
      "Lining Axforce 90 Dragon là vợt flagship của Li-Ning năm 2023, lấy cảm hứng từ rồng phương Đông. Phiên bản Dragon có màu đỏ vàng nổi bật, sử dụng sợi carbon T900 cao cấp nhất. Smash mạnh, kiểm soát tốt, là niềm tự hào của dòng Axforce.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "308mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Extra Stiff" },
      { key: "Chất liệu", value: "Toray T900 Carbon" },
      { key: "Lực căng tối đa", value: "32 lbs" },
      { key: "Phong cách", value: "Tấn công mạnh" },
    ],
  },
  {
    name: "Lining Axforce 90 Tiger",
    slug: "lining-axforce-90-tiger",
    brand: "Lining",
    price: 5800000,
    stock: 5,
    thumbnail: "/products/axforce90tiger.jpg",
    description:
      "Lining Axforce 90 Tiger là phiên bản song sinh với Dragon nhưng có màu vàng đen của hổ. Cùng thông số kỹ thuật cao cấp, khác biệt ở màu sắc và họa tiết. Đây là bộ sưu tập giới hạn dành cho người chơi cầu lông muốn thể hiện phong cách riêng.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "308mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Extra Stiff" },
      { key: "Chất liệu", value: "Toray T900 Carbon" },
      { key: "Lực căng tối đa", value: "32 lbs" },
      { key: "Phong cách", value: "Tấn công mạnh" },
    ],
  },
  {
    name: "Lining Axforce 80",
    slug: "lining-axforce-80",
    brand: "Lining",
    price: 3600000,
    stock: 13,
    thumbnail: "/products/axforce80.jpg",
    description:
      "Lining Axforce 80 là vợt tầm cao cấp phù hợp cho bán chuyên. Cứng hơn Axforce 70, cho smash mạnh hơn nhưng vẫn giữ được cảm giác kiểm soát cầu. Lý tưởng cho người chơi đơn muốn upgrade từ vợt tầm trung.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "300mm (Đầu nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "High Modulus Carbon + Resin" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tấn công" },
    ],
  },
  {
    name: "Lining Axforce 70",
    slug: "lining-axforce-70",
    brand: "Lining",
    price: 2700000,
    stock: 17,
    thumbnail: "/products/axforce70.jpg",
    description:
      "Lining Axforce 70 là vợt tầm trung của dòng Axforce, cân bằng giữa tốc độ và lực. Phù hợp cho người chơi phong trào đến bán chuyên muốn vợt tốt trong tầm giá hợp lý. Thiết kế hiện đại, bền bỉ.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "293mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "Graphite + Resin" },
      { key: "Lực căng tối đa", value: "26 lbs" },
      { key: "Phong cách", value: "Cân bằng" },
    ],
  },
  {
    name: "Lining BladeX 900",
    slug: "lining-bladex-900",
    brand: "Lining",
    price: 4300000,
    stock: 9,
    thumbnail: "/products/bladex900.jpg",
    description:
      "Lining BladeX 900 là vợt tốc độ cao cấp của Li-Ning dành cho đôi nam. Thiết kế khung mỏng Air-Stream giảm lực cản khí, tăng tốc swing. Cán nhẹ và linh hoạt, phản xạ lưới cực nhanh. Phù hợp vận động viên cần tốc độ phản ứng tối đa.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "5U (75–79g)" },
      { key: "Điểm cân bằng", value: "280mm (Cán nặng)" },
      { key: "Độ cứng", value: "Stiff" },
      { key: "Chất liệu", value: "Toray T700 Carbon + Air-Stream Frame" },
      { key: "Lực căng tối đa", value: "28 lbs" },
      { key: "Phong cách", value: "Tốc độ – Tay đôi" },
    ],
  },
  {
    name: "Lining BladeX 800",
    slug: "lining-bladex-800",
    brand: "Lining",
    price: 3100000,
    stock: 14,
    thumbnail: "/products/bladex800.jpg",
    description:
      "Lining BladeX 800 là vợt tốc độ tầm trung, nhẹ và linh hoạt. Phù hợp cho người chơi đôi muốn phản xạ nhanh ở lưới. Dễ làm quen, bền bỉ trong điều kiện thi đấu phong trào.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "5U (75–79g)" },
      { key: "Điểm cân bằng", value: "283mm (Cán nặng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "High Modulus Graphite" },
      { key: "Lực căng tối đa", value: "26 lbs" },
      { key: "Phong cách", value: "Tốc độ" },
    ],
  },
  {
    name: "Lining BladeX 700",
    slug: "lining-bladex-700",
    brand: "Lining",
    price: 2200000,
    stock: 19,
    thumbnail: "/products/bladex700.jpg",
    description:
      "Lining BladeX 700 là vợt nhập môn tốc độ của dòng BladeX. Nhẹ, dễ cầm, phù hợp người mới chơi hoặc người chơi phong trào muốn vợt nhẹ tay. Giá hợp lý, thiết kế đẹp.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "5U (75–79g)" },
      { key: "Điểm cân bằng", value: "285mm (Cân bằng)" },
      { key: "Độ cứng", value: "Flexible" },
      { key: "Chất liệu", value: "Graphite" },
      { key: "Lực căng tối đa", value: "24 lbs" },
      { key: "Phong cách", value: "Tốc độ – Nhập môn" },
    ],
  },
  {
    name: "Kawasaki Tectonic 7",
    slug: "kawasaki-tectonic-7",
    brand: "Kawasaki",
    price: 1800000,
    stock: 22,
    thumbnail: "/products/tectonic7.jpg",
    description:
      "Kawasaki Tectonic 7 là vợt phong trào giá tốt, phù hợp người mới tập chơi cầu lông. Trọng lượng nhẹ, cân bằng trung lập, dễ cầm và kiểm soát. Bền bỉ trong điều kiện tập luyện thường xuyên.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "285mm (Cân bằng)" },
      { key: "Độ cứng", value: "Flexible" },
      { key: "Chất liệu", value: "Graphite Composite" },
      { key: "Lực căng tối đa", value: "24 lbs" },
      { key: "Phong cách", value: "Cân bằng – Phong trào" },
    ],
  },
  {
    name: "Kawasaki Tectonic 9",
    slug: "kawasaki-tectonic-9",
    brand: "Kawasaki",
    price: 2300000,
    stock: 18,
    thumbnail: "/products/tectonic9.jpg",
    description:
      "Kawasaki Tectonic 9 nâng cấp so với Tectonic 7 với khung carbon tinh chế hơn. Cứng hơn một chút, lực smash ổn định, vẫn trong tầm giá phù hợp người chơi phong trào đến bán chuyên mới vào nghề.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "290mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "Graphite" },
      { key: "Lực căng tối đa", value: "26 lbs" },
      { key: "Phong cách", value: "Cân bằng" },
    ],
  },
  {
    name: "Lining Aeronaut 9000C",
    slug: "lining-aeronaut-9000c",
    brand: "Lining",
    price: 4100000,
    stock: 10,
    thumbnail: "/products/aeronaut9000c.jpg",
    description:
      "Lining Aeronaut 9000C là vợt cân bằng cao cấp, phù hợp cho người chơi toàn diện. Công nghệ tối ưu khí động học giúp swing nhanh hơn, kiểm soát cầu tốt hơn. Thích hợp cho thi đấu phong trào lẫn bán chuyên.",
    categorySlug: "vot-cau-long",
    specs: [
      { key: "Trọng lượng", value: "4U (80–84g)" },
      { key: "Điểm cân bằng", value: "290mm (Cân bằng)" },
      { key: "Độ cứng", value: "Medium" },
      { key: "Chất liệu", value: "High Modulus Carbon" },
      { key: "Lực căng tối đa", value: "27 lbs" },
      { key: "Phong cách", value: "Cân bằng toàn diện" },
    ],
  },

  // ══════════════════════════════════════════
  // GIÀY CẦU LÔNG (20 sản phẩm)
  // ══════════════════════════════════════════
  {
    name: "Yonex SHB 65Z3",
    slug: "yonex-shb-65z3",
    brand: "Yonex",
    price: 2800000,
    stock: 20,
    thumbnail: "/products/shb65z3.jpg",
    description:
      "Yonex SHB 65Z3 là đôi giày cầu lông chuyên nghiệp cao cấp, được nhiều vận động viên quốc tế tin dùng. Đế Power Cushion Plus hấp thụ lực tác động, phản hồi năng lượng tối đa. Mũi giày Hexagrip chống trượt hiệu quả. Thiết kế ôm chân, hỗ trợ mắt cá tốt. Phù hợp thi đấu sàn gỗ và sàn PU.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Power Cushion Plus" },
      { key: "Đế ngoài", value: "Hexagrip" },
      { key: "Chất liệu mũi", value: "Durable Skin" },
      { key: "Trọng lượng (size 42)", value: "290g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà (gỗ, PU)" },
      { key: "Phong cách", value: "Toàn diện" },
    ],
  },
  {
    name: "Yonex SHB Aerus Z",
    slug: "yonex-shb-aerus-z",
    brand: "Yonex",
    price: 3200000,
    stock: 15,
    thumbnail: "/products/shbaerusz.jpg",
    description:
      "Yonex SHB Aerus Z là giày cầu lông nhẹ nhất của Yonex, chỉ khoảng 220g (size 42). Thiết kế Ergoshape ôm khít bàn chân tự nhiên. Công nghệe Power Cushion + tối ưu cho thi đấu tốc độ cao. Lưới thoáng khí, êm ái, giảm mệt mỏi trong trận dài.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Power Cushion +" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "220g" },
      { key: "Công nghệ", value: "Ergoshape + Dynawalk" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Tốc độ" },
    ],
  },
  {
    name: "Yonex SHB Comfort Z",
    slug: "yonex-shb-comfort-z",
    brand: "Yonex",
    price: 1900000,
    stock: 25,
    thumbnail: "/products/shbcomfortz.jpg",
    description:
      "Yonex SHB Comfort Z là giày cầu lông tầm trung, ưu tiên sự thoải mái khi chơi dài. Đế Power Cushion êm, hỗ trợ cung bàn chân tốt. Phù hợp cho người chơi phong trào thường xuyên, cần giày bền và thoải mái hơn là hiệu năng thi đấu đỉnh cao.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Power Cushion" },
      { key: "Đế ngoài", value: "Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "280g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào – Êm ái" },
    ],
  },
  {
    name: "Yonex SHB 88 Dial",
    slug: "yonex-shb-88-dial",
    brand: "Yonex",
    price: 2400000,
    stock: 18,
    thumbnail: "/products/shb88dial.jpg",
    description:
      "Yonex SHB 88 Dial là giày cầu lông chuyên dụng cho tay đơn. Thiết kế Dual Mode Heel giúp đổi hướng nhanh, hỗ trợ bứt tốc từ gót chân. Đế Power Cushion hấp thụ lực tốt. Phù hợp người chơi đơn cần di chuyển linh hoạt.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Power Cushion" },
      { key: "Công nghệ", value: "Dual Mode Heel" },
      { key: "Đế ngoài", value: "Round Sole" },
      { key: "Trọng lượng (size 42)", value: "265g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Di chuyển – Đơn" },
    ],
  },
  {
    name: "Victor Wave Fang 2",
    slug: "victor-wave-fang-2",
    brand: "Victor",
    price: 2100000,
    stock: 22,
    thumbnail: "/products/wavefang2.jpg",
    description:
      "Victor Wave Fang 2 là giày cầu lông tầm trung của Victor, thiết kế cân bằng giữa nhẹ và bền. Đế VSR (Victor Shock Reduction) giảm chấn tốt. Mũi giày Dupont Kevlar chống mài mòn. Thích hợp thi đấu phong trào.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "VSR (Victor Shock Reduction)" },
      { key: "Mũi giày", value: "Dupont Kevlar" },
      { key: "Đế ngoài", value: "Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "270g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Cân bằng" },
    ],
  },
  {
    name: "Victor Wave Claw 3",
    slug: "victor-wave-claw-3",
    brand: "Victor",
    price: 2600000,
    stock: 16,
    thumbnail: "/products/waveclaw3.jpg",
    description:
      "Victor Wave Claw 3 là giày chuyên dụng cho tay đôi và tay đơn. Công nghệ ENERGYMAX giúp phục hồi lực từ đế, tăng độ bật và bứt tốc. Đế ngoài kẻ sọc chống trượt tốt trên sàn cầu lông. Ôm chân, hỗ trợ cổ chân hiệu quả.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "ENERGYMAX" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Công nghệ", value: "Anti-Torsion System" },
      { key: "Trọng lượng (size 42)", value: "255g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Tốc độ – Bứt phá" },
    ],
  },
  {
    name: "Kawasaki Lightning Neo",
    slug: "kawasaki-lightning-neo",
    brand: "Kawasaki",
    price: 1200000,
    stock: 30,
    thumbnail: "/products/lightningneo.jpg",
    description:
      "Kawasaki Lightning Neo là giày cầu lông phổ thông giá tốt, phù hợp người mới chơi hoặc tập luyện hằng ngày. Đế cao su chống trượt cơ bản, lót giày êm ái. Dễ lựa chọn size, thiết kế trẻ trung.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA Foam" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "295g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào – Nhập môn" },
    ],
  },
  {
    name: "Apacs Attack Pro",
    slug: "apacs-attack-pro",
    brand: "Apacs",
    price: 1500000,
    stock: 25,
    thumbnail: "/products/attackpro.jpg",
    description:
      "Apacs Attack Pro là giày cầu lông tầm trung giá hợp lý. Thiết kế chắc chắn, hỗ trợ cổ chân tốt. Đế cao su chống trượt bền bỉ. Phù hợp người chơi thường xuyên với ngân sách hạn chế.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "PU Insole" },
      { key: "Đế ngoài", value: "Rubber Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "300g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào" },
    ],
  },
  {
    name: "Mizuno Power Cushion Eclipson",
    slug: "mizuno-power-cushion-eclipson",
    brand: "Mizuno",
    price: 3500000,
    stock: 12,
    thumbnail: "/products/powercushioneclipson.jpg",
    description:
      "Mizuno Power Cushion Eclipson là giày cầu lông cao cấp của Mizuno, sử dụng công nghệ đệm Wave Plate giảm chấn ưu việt. Thiết kế ôm chân tự nhiên, phù hợp bàn chân châu Á. Trọng lượng nhẹ, bền bỉ, hiệu năng cao trong thi đấu.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Wave Plate + U4icX" },
      { key: "Đế ngoài", value: "Phaseon Rubber" },
      { key: "Trọng lượng (size 42)", value: "260g" },
      { key: "Công nghệ", value: "Mizuno Wave + SmoothRide" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Toàn diện" },
    ],
  },
  {
    name: "Mizuno Power Cushion Cascade",
    slug: "mizuno-power-cushion-cascade",
    brand: "Mizuno",
    price: 2900000,
    stock: 14,
    thumbnail: "/products/powercushioncascade.jpg",
    description:
      "Mizuno Power Cushion Cascade là giày thi đấu cao cấp với đế Mizuno Wave đặc trưng. Hấp thụ lực cực tốt, đặc biệt khi đánh nhảy smash. Phù hợp người chơi nặng cân hoặc đánh đơn nhiều di chuyển dứt khoát.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Mizuno Wave" },
      { key: "Đế ngoài", value: "Rubber Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "275g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Tấn công – Nhảy smash" },
    ],
  },
  {
    name: "Victor Wave Fang Pro",
    slug: "victor-wave-fang-pro",
    brand: "Victor",
    price: 2400000,
    stock: 19,
    thumbnail: "/products/wavefangpro.jpg",
    description:
      "Victor Wave Fang Pro nâng cấp so với Wave Fang 2 với đế ENERGYMAX II cải tiến, cung cấp phản hồi năng lượng tốt hơn. Phù hợp người chơi bán chuyên muốn hiệu năng cao hơn trong tầm giá vừa phải.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "ENERGYMAX II" },
      { key: "Mũi giày", value: "Dupont Kevlar" },
      { key: "Đế ngoài", value: "Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "265g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Bán chuyên" },
    ],
  },
  {
    name: "Victor Wave Claw Neo",
    slug: "victor-wave-claw-neo",
    brand: "Victor",
    price: 3100000,
    stock: 13,
    thumbnail: "/products/waveclawneo.jpg",
    description:
      "Victor Wave Claw Neo là phiên bản mới nhất của dòng Wave Claw, cải tiến hệ thống đệm và tăng độ bền mũi giày. Công nghệ ENERGYMAX III cho phản xạ nhanh nhất dòng Wave Claw. Thiết kế cổ thấp linh hoạt, phù hợp tay đôi thi đấu.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "ENERGYMAX III" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Công nghệ", value: "Lace System + Anti-Torsion" },
      { key: "Trọng lượng (size 42)", value: "250g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Tốc độ – Đôi" },
    ],
  },
  {
    name: "Kawasaki King K9",
    slug: "kawasaki-king-k9",
    brand: "Kawasaki",
    price: 2800000,
    stock: 10,
    thumbnail: "/products/kawasakikingk9.jpg",
    description:
      "Kawasaki King K9 là mẫu giày cao cấp nhất của Kawasaki, sử dụng vật liệu cao cấp hơn các dòng khác. Đế trong DPE giảm chấn tốt, thiết kế ôm chân chắc chắn. Phù hợp cho người chơi phong trào nặng đô muốn giày tốt giá tốt.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "DPE Cushion" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "285g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào – Bền bỉ" },
    ],
  },
  {
    name: "Kawasaki King K8",
    slug: "kawasaki-king-k8",
    brand: "Kawasaki",
    price: 2100000,
    stock: 16,
    thumbnail: "/products/kawasakikingk8.jpg",
    description:
      "Kawasaki King K8 là giày phong trào tầm trung của Kawasaki, bền bỉ và thoải mái khi chơi dài. Đế cao su chống trượt tốt, phù hợp sàn trong nhà. Giá thành hợp lý, là lựa chọn phổ biến tại các câu lạc bộ phong trào.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA + PU" },
      { key: "Đế ngoài", value: "Rubber Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "290g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào" },
    ],
  },
  {
    name: "Kawasaki King K7",
    slug: "kawasaki-king-k7",
    brand: "Kawasaki",
    price: 1600000,
    stock: 28,
    thumbnail: "/products/kawasakikingk7.jpg",
    description:
      "Kawasaki King K7 là giày nhập môn kinh tế của Kawasaki. Nhẹ, bền, đế chống trượt cơ bản, phù hợp người mới chơi hoặc muốn giày phong trào giá rẻ.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA Foam" },
      { key: "Đế ngoài", value: "Rubber Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "300g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Nhập môn" },
    ],
  },
  {
    name: "Kawasaki Precision 88",
    slug: "kawasaki-precision-88",
    brand: "Kawasaki",
    price: 1850000,
    stock: 20,
    thumbnail: "/products/kawasakiprecision88.jpg",
    description:
      "Kawasaki Precision 88 là mẫu giày thiết kế dành cho người chơi cần sự ổn định và chính xác trong di chuyển. Đế chống trượt tốt, hỗ trợ cổ chân vừa phải. Phù hợp tập luyện thường xuyên.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA + Memory Foam" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "285g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Ổn định – Di chuyển" },
    ],
  },
  {
    name: "Mizuno Wave Fang Pro 01",
    slug: "mizuno-wave-fang-pro-01",
    brand: "Mizuno",
    price: 3800000,
    stock: 10,
    thumbnail: "/products/mizunopro01.jpg",
    description:
      "Mizuno Badminton Pro 01 là giày thi đấu chuyên nghiệp, sử dụng công nghệ Wave Plate độc quyền của Mizuno. Hệ thống giảm chấn ưu việt bảo vệ đầu gối và cổ chân. Thiết kế nhẹ, linh hoạt, phù hợp thi đấu cấp độ cao.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "Wave Plate + SmoothRide" },
      { key: "Đế ngoài", value: "Premium Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "255g" },
      { key: "Loại sàn phù hợp", value: "Sàn gỗ chuyên dụng" },
      { key: "Phong cách", value: "Thi đấu chuyên nghiệp" },
    ],
  },
  {
    name: "Kawasaki Explorer 90",
    slug: "kawasaki-explorer-90",
    brand: "Kawasaki",
    price: 2200000,
    stock: 17,
    thumbnail: "/products/kawasakiexplorer90.jpg",
    description:
      "Kawasaki Explorer 90 là giày cầu lông tầm trung với thiết kế hiện đại. Đế êm, hỗ trợ tốt khi di chuyển đa hướng. Phù hợp cho người chơi phong trào đến bán chuyên.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA + PU" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "275g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào – Bán chuyên" },
    ],
  },
  {
    name: "Kawasaki Power X",
    slug: "kawasaki-power-x",
    brand: "Kawasaki",
    price: 1750000,
    stock: 22,
    thumbnail: "/products/kawasakipowerx.jpg",
    description:
      "Kawasaki Power X là giày cầu lông phổ thông, nhẹ và bền. Phù hợp người chơi phong trào muốn giày tốt trong tầm giá hợp lý dưới 2 triệu.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "EVA Foam" },
      { key: "Đế ngoài", value: "Rubber Non-Marking" },
      { key: "Trọng lượng (size 42)", value: "290g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Phong trào" },
    ],
  },
  {
    name: "Kawasaki Force 900",
    slug: "kawasaki-force-900",
    brand: "Kawasaki",
    price: 2500000,
    stock: 14,
    thumbnail: "/products/kawasakiforce900.jpg",
    description:
      "Kawasaki Force 900 là mẫu giày thi đấu bán chuyên của Kawasaki, mang lại hiệu năng tốt trong tầm giá 2-3 triệu. Đế cao su chất lượng, êm ái và bền bỉ.",
    categorySlug: "giay-cau-long",
    specs: [
      { key: "Đế trong", value: "DPE + EVA" },
      { key: "Đế ngoài", value: "Non-Marking Rubber" },
      { key: "Trọng lượng (size 42)", value: "270g" },
      { key: "Loại sàn phù hợp", value: "Sàn trong nhà" },
      { key: "Phong cách", value: "Bán chuyên" },
    ],
  },

  // ══════════════════════════════════════════
  // TÚI CẦU LÔNG (10 sản phẩm)
  // ══════════════════════════════════════════
  {
    name: "Yonex Pro Backpack",
    slug: "yonex-pro-backpack",
    brand: "Yonex",
    price: 1200000,
    stock: 20,
    thumbnail: "/products/probackpack.jpg",
    description:
      "Yonex Pro Backpack là balo thể thao đa năng, thiết kế riêng cho cầu lông. Ngăn chính rộng chứa được 1–2 vợt (kèm bao vợt), ngăn phụ đựng giày, khăn, và đồ dùng cá nhân. Chất liệu chống nước, dây đeo êm vai, phù hợp đi tập hằng ngày.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Dung tích", value: "30L" },
      { key: "Số ngăn", value: "3 ngăn chính + 2 ngăn phụ" },
      { key: "Chứa vợt", value: "1–2 vợt" },
      { key: "Chất liệu", value: "Polyester chống nước" },
      { key: "Kích thước", value: "30 x 20 x 50 cm" },
    ],
  },
  {
    name: "Yonex Tournament Bag",
    slug: "yonex-tournament-bag",
    brand: "Yonex",
    price: 2200000,
    stock: 12,
    thumbnail: "/products/tournamentbag.jpg",
    description:
      "Yonex Tournament Bag là túi cầu lông dài cao cấp, chứa được 9–12 vợt. Thiết kế chuyên nghiệp với nhiều ngăn phân loại đồ tiện lợi. Ngăn giày riêng biệt, ngăn nhiệt giữ ấm vợt. Phù hợp vận động viên thi đấu.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Dung tích", value: "45L" },
      { key: "Chứa vợt", value: "9–12 vợt" },
      { key: "Số ngăn", value: "3 ngăn chính" },
      { key: "Chất liệu", value: "Polyester cao cấp" },
      { key: "Tính năng đặc biệt", value: "Ngăn giữ nhiệt, ngăn giày" },
      { key: "Kích thước", value: "80 x 33 x 28 cm" },
    ],
  },
  {
    name: "Victor Racket Bag Pro",
    slug: "victor-racket-bag-pro",
    brand: "Victor",
    price: 1800000,
    stock: 15,
    thumbnail: "/products/racketbagpro.jpg",
    description:
      "Victor Racket Bag Pro là túi đựng vợt cầu lông dạng dài, chứa 6 vợt. Thiết kế thanh lịch, màu sắc đa dạng. Ngăn phụ đựng giày và đồ dùng cá nhân. Phù hợp người chơi phong trào đến bán chuyên cần túi gọn nhẹ.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "6 vợt" },
      { key: "Số ngăn", value: "2 ngăn chính + 1 ngăn phụ" },
      { key: "Chất liệu", value: "Polyester chống nước" },
      { key: "Kích thước", value: "75 x 30 x 25 cm" },
      { key: "Đeo vai", value: "2 quai đeo vai" },
    ],
  },
  {
    name: "Lining Elite Bag",
    slug: "lining-elite-bag",
    brand: "Lining",
    price: 2500000,
    stock: 10,
    thumbnail: "/products/elitebag.jpg",
    description:
      "Lining Elite Bag là túi cầu lông cao cấp dành cho vận động viên chuyên nghiệp. Chứa được 12 vợt, nhiều ngăn phân loại tiện lợi, ngăn giữ ẩm riêng cho giày. Thiết kế sang trọng, chất liệu bền bỉ.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "12 vợt" },
      { key: "Số ngăn", value: "4 ngăn chính" },
      { key: "Chất liệu", value: "Nylon cao cấp" },
      { key: "Kích thước", value: "85 x 35 x 30 cm" },
      { key: "Tính năng đặc biệt", value: "Ngăn cách nhiệt, ngăn giày riêng" },
    ],
  },
  {
    name: "Victor Tour Bag",
    slug: "victor-tour-bag",
    brand: "Victor",
    price: 2000000,
    stock: 13,
    thumbnail: "/products/tourbag.jpg",
    description:
      "Victor Tour Bag là túi du lịch thể thao cầu lông, dung lượng lớn chứa đủ đồ cho chuyến thi đấu xa. Chứa 9 vợt, có ngăn giày, ngăn quần áo và đồ dùng cá nhân riêng biệt. Có bánh xe kéo tiện lợi.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "9 vợt" },
      { key: "Số ngăn", value: "3 ngăn chính" },
      { key: "Chất liệu", value: "Polyester chống nước" },
      { key: "Kích thước", value: "78 x 32 x 28 cm" },
      { key: "Tính năng đặc biệt", value: "Có bánh xe kéo" },
    ],
  },
  {
    name: "Lining Team Bag",
    slug: "lining-team-bag",
    brand: "Lining",
    price: 1500000,
    stock: 18,
    thumbnail: "/products/teambag.jpg",
    description:
      "Lining Team Bag là túi cầu lông cho đội nhóm, màu sắc đặc trưng, in logo dễ nhận biết. Chứa 6 vợt, ngăn phụ rộng, bền bỉ khi vận chuyển nhiều. Phù hợp câu lạc bộ hoặc đội nhóm phong trào.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "6 vợt" },
      { key: "Số ngăn", value: "2 ngăn chính + 2 ngăn phụ" },
      { key: "Chất liệu", value: "Polyester" },
      { key: "Kích thước", value: "72 x 28 x 24 cm" },
    ],
  },
  {
    name: "Victor Pro Tour Bag",
    slug: "victor-pro-tour-bag",
    brand: "Victor",
    price: 2800000,
    stock: 8,
    thumbnail: "/products/protourbag.jpg",
    description:
      "Victor Pro Tour Bag là túi cầu lông chuyên nghiệp cao cấp, chứa 12 vợt. Thiết kế sang trọng, ngăn cách nhiệt bảo vệ vợt và cước, ngăn giày riêng biệt. Phù hợp vận động viên chuyên nghiệp.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "12 vợt" },
      { key: "Số ngăn", value: "3 ngăn chính + 2 ngăn phụ" },
      { key: "Chất liệu", value: "Nylon chống nước" },
      { key: "Tính năng đặc biệt", value: "Ngăn cách nhiệt, ngăn giày" },
      { key: "Kích thước", value: "85 x 33 x 30 cm" },
    ],
  },
  {
    name: "Yonex Competition Bag",
    slug: "yonex-competition-bag",
    brand: "Yonex",
    price: 1700000,
    stock: 14,
    thumbnail: "/products/competitionbag.jpg",
    description:
      "Yonex Competition Bag là túi thi đấu tầm trung của Yonex, chứa 6 vợt. Thiết kế gọn nhẹ, dây đeo điều chỉnh được, phù hợp người hay di chuyển. Chất liệu polyester bền, chống nước tốt.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "6 vợt" },
      { key: "Số ngăn", value: "2 ngăn" },
      { key: "Chất liệu", value: "Polyester chống nước" },
      { key: "Kích thước", value: "73 x 29 x 24 cm" },
    ],
  },
  {
    name: "Kawasaki Badminton Bag 01",
    slug: "kawasaki-badminton-bag-01",
    brand: "Kawasaki",
    price: 900000,
    stock: 25,
    thumbnail: "/products/badmintonbag01.jpg",
    description:
      "Kawasaki Badminton Bag 01 là túi cầu lông phổ thông giá rẻ, phù hợp người mới chơi. Chứa 2–3 vợt, ngăn phụ đựng cầu và đồ nhỏ. Nhẹ, gọn, tiện lợi.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "2–3 vợt" },
      { key: "Số ngăn", value: "1 ngăn chính + 1 ngăn phụ" },
      { key: "Chất liệu", value: "Polyester" },
      { key: "Kích thước", value: "68 x 25 x 20 cm" },
    ],
  },
  {
    name: "Kawasaki Badminton Bag 02",
    slug: "kawasaki-badminton-bag-02",
    brand: "Kawasaki",
    price: 1100000,
    stock: 20,
    thumbnail: "/products/badmintonbag02.jpg",
    description:
      "Kawasaki Badminton Bag 02 là balo cầu lông phong trào 2 ngăn, chứa 2–4 vợt. Dây đeo êm vai, lưng có đệm thoáng khí. Phù hợp học sinh, sinh viên hoặc người chơi phong trào.",
    categorySlug: "tui-cau-long",
    specs: [
      { key: "Chứa vợt", value: "2–4 vợt" },
      { key: "Dung tích", value: "20L" },
      { key: "Số ngăn", value: "2 ngăn chính" },
      { key: "Chất liệu", value: "Polyester thoáng khí" },
      { key: "Kích thước", value: "28 x 18 x 46 cm" },
    ],
  },

  // ══════════════════════════════════════════
  // DÂY CƯỚC (20 sản phẩm)
  // ══════════════════════════════════════════
  {
    name: "Yonex BG65",
    slug: "yonex-bg65",
    brand: "Yonex",
    price: 95000,
    stock: 100,
    thumbnail: "/products/bg65.jpg",
    description:
      "Yonex BG65 là dây cước cầu lông bán chạy nhất thế giới. Độ bền cao, cảm giác đánh ổn định, phù hợp cho mọi trình độ từ phong trào đến bán chuyên. Đường kính 0.70mm, dệt đơn, lực căng khuyến nghị 20–27 lbs. Lý tưởng cho người mới chọn dây đầu tiên.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.70mm" },
      { key: "Lực căng khuyến nghị", value: "20–27 lbs" },
      { key: "Cấu trúc", value: "Dệt đơn (Multifilament)" },
      { key: "Cảm giác đánh", value: "Bền – Ổn định" },
      { key: "Phù hợp", value: "Mọi trình độ" },
    ],
  },
  {
    name: "Yonex BG80",
    slug: "yonex-bg80",
    brand: "Yonex",
    price: 130000,
    stock: 80,
    thumbnail: "/products/bg80.jpg",
    description:
      "Yonex BG80 là dây cước cao cấp của Yonex, mỏng hơn BG65 (0.68mm), cho cảm giác đánh sắc bén và lực smash mạnh hơn. Lõi trắng đặc trưng, độ bền tốt ở lực căng cao. Phù hợp người chơi bán chuyên đến chuyên nghiệp.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.68mm" },
      { key: "Lực căng khuyến nghị", value: "22–30 lbs" },
      { key: "Cấu trúc", value: "Dệt đơn" },
      { key: "Cảm giác đánh", value: "Sắc bén – Lực tốt" },
      { key: "Phù hợp", value: "Bán chuyên – Chuyên nghiệp" },
    ],
  },
  {
    name: "Yonex BG66 Ultimax",
    slug: "yonex-bg66-ultimax",
    brand: "Yonex",
    price: 145000,
    stock: 70,
    thumbnail: "/products/bg66ultimax.jpg",
    description:
      "Yonex BG66 Ultimax là dây cước tốc độ hàng đầu của Yonex, đường kính siêu mỏng 0.65mm. Được ưa chuộng bởi các tay đôi chuyên nghiệp cần tốc độ phản hồi cực nhanh. Cảm giác đánh sắc, nhẹ, lực căng cao. Hy sinh độ bền để đổi lấy hiệu năng.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.65mm" },
      { key: "Lực căng khuyến nghị", value: "24–30 lbs" },
      { key: "Cấu trúc", value: "Dệt đơn" },
      { key: "Cảm giác đánh", value: "Tốc độ – Sắc bén" },
      { key: "Phù hợp", value: "Tay đôi chuyên nghiệp" },
    ],
  },
  {
    name: "Yonex Exbolt 63",
    slug: "yonex-exbolt-63",
    brand: "Yonex",
    price: 155000,
    stock: 65,
    thumbnail: "/products/exbolt63.jpg",
    description:
      "Yonex Exbolt 63 là dây cước mới nhất của Yonex, ra mắt 2022. Đường kính 0.63mm siêu mỏng, cho tốc độ phục hồi cực nhanh. Lõi Power Mesh chịu lực căng cao vượt trội. Được nhiều VĐV chuyên nghiệp chuyển sang dùng từ BG66 Ultimax.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.63mm" },
      { key: "Lực căng khuyến nghị", value: "25–32 lbs" },
      { key: "Cấu trúc", value: "Power Mesh Core" },
      { key: "Cảm giác đánh", value: "Tốc độ tối đa – Phản hồi nhanh" },
      { key: "Phù hợp", value: "Chuyên nghiệp" },
    ],
  },
  {
    name: "Yonex Exbolt 65",
    slug: "yonex-exbolt-65",
    brand: "Yonex",
    price: 140000,
    stock: 72,
    thumbnail: "/products/exbolt65.jpg",
    description:
      "Yonex Exbolt 65 là phiên bản cân bằng hơn của Exbolt 63, đường kính 0.65mm giúp bền hơn nhưng vẫn giữ được cảm giác tốc độ. Phù hợp người chơi muốn cước tốc độ nhưng cần độ bền cao hơn.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.65mm" },
      { key: "Lực căng khuyến nghị", value: "24–30 lbs" },
      { key: "Cấu trúc", value: "Power Mesh Core" },
      { key: "Cảm giác đánh", value: "Tốc độ – Bền" },
      { key: "Phù hợp", value: "Bán chuyên – Chuyên nghiệp" },
    ],
  },
  {
    name: "Victor VBS66 Nano",
    slug: "victor-vbs66-nano",
    brand: "Victor",
    price: 125000,
    stock: 75,
    thumbnail: "/products/vbs66nano.jpg",
    description:
      "Victor VBS66 Nano là dây cước tốc độ nổi tiếng của Victor, đường kính 0.66mm. Sử dụng nano fibre tăng độ bền và giảm ma sát. Cảm giác đánh sắc, nhanh, phù hợp tay đôi. Là lựa chọn phổ biến ở giải phong trào.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.66mm" },
      { key: "Lực căng khuyến nghị", value: "22–28 lbs" },
      { key: "Cấu trúc", value: "Nano Fibre" },
      { key: "Cảm giác đánh", value: "Tốc độ – Sắc" },
      { key: "Phù hợp", value: "Tay đôi – Phong trào" },
    ],
  },
  {
    name: "Victor VBS68 Power",
    slug: "victor-vbs68-power",
    brand: "Victor",
    price: 120000,
    stock: 80,
    thumbnail: "/products/vbs68power.jpg",
    description:
      "Victor VBS68 Power là dây cước tấn công của Victor, đường kính 0.68mm. Ưu tiên lực và độ bền, phù hợp người chơi tấn công ưa thích smash mạnh. Ổn định ở lực căng trung bình.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.68mm" },
      { key: "Lực căng khuyến nghị", value: "20–28 lbs" },
      { key: "Cấu trúc", value: "Dệt đơn" },
      { key: "Cảm giác đánh", value: "Lực – Bền" },
      { key: "Phù hợp", value: "Tấn công – Phong trào" },
    ],
  },
  {
    name: "Lining No.1",
    slug: "lining-no1",
    brand: "Lining",
    price: 160000,
    stock: 60,
    thumbnail: "/products/liningno1.jpg",
    description:
      "Lining No.1 là dây cước cao cấp nhất của Li-Ning, đường kính 0.65mm. Được thiết kế cho tay đôi chuyên nghiệp thi đấu quốc tế. Tốc độ phục hồi cực nhanh, cảm giác đánh sắc bén, bền hơn so với các dây cùng đường kính nhờ lõi đặc biệt.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.65mm" },
      { key: "Lực căng khuyến nghị", value: "24–30 lbs" },
      { key: "Cấu trúc", value: "High-End Core" },
      { key: "Cảm giác đánh", value: "Tốc độ – Chuẩn xác" },
      { key: "Phù hợp", value: "Chuyên nghiệp – Tay đôi" },
    ],
  },
  {
    name: "Lining No.5",
    slug: "lining-no5",
    brand: "Lining",
    price: 110000,
    stock: 85,
    thumbnail: "/products/liningno5.jpg",
    description:
      "Lining No.5 là dây cước tầm trung của Li-Ning, cân bằng giữa lực và tốc độ. Đường kính 0.70mm, bền, phù hợp người chơi phong trào muốn dây tốt giá hợp lý.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.70mm" },
      { key: "Lực căng khuyến nghị", value: "20–26 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Cân bằng – Bền" },
      { key: "Phù hợp", value: "Phong trào – Bán chuyên" },
    ],
  },
  {
    name: "Yonex Aerobite",
    slug: "yonex-aerobite",
    brand: "Yonex",
    price: 165000,
    stock: 55,
    thumbnail: "/products/aerobite.jpg",
    description:
      "Yonex Aerobite là dây cước hybrid độc đáo, kết hợp dây dọc trắng (0.67mm) và dây ngang vàng (0.61mm). Thiết kế hybrid tạo hiệu ứng xoáy tự nhiên cho cầu, giúp các cú drop và cắt cầu hiệu quả hơn. Được nhiều VĐV hỗn hợp và đơn nữ tin dùng.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính dây dọc", value: "0.67mm (trắng)" },
      { key: "Đường kính dây ngang", value: "0.61mm (vàng)" },
      { key: "Lực căng khuyến nghị", value: "22–28 lbs" },
      { key: "Cấu trúc", value: "Hybrid" },
      { key: "Cảm giác đánh", value: "Xoáy – Kiểm soát" },
      { key: "Phù hợp", value: "Kỹ thuật – Đơn nữ" },
    ],
  },
  {
    name: "Kawasaki Master 800",
    slug: "kawasaki-master-800",
    brand: "Kawasaki",
    price: 85000,
    stock: 90,
    thumbnail: "/products/kawasakimaster800.jpg",
    description:
      "Kawasaki Master 800 là dây cước phổ thông giá tốt nhất thị trường. Bền bỉ, ổn định, phù hợp người chơi phong trào hoặc thay dây thường xuyên. Đường kính 0.70mm, dễ căng.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.70mm" },
      { key: "Lực căng khuyến nghị", value: "18–24 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Bền – Phổ thông" },
      { key: "Phù hợp", value: "Nhập môn – Phong trào" },
    ],
  },
  {
    name: "Kawasaki Light 500",
    slug: "kawasaki-light-500",
    brand: "Kawasaki",
    price: 75000,
    stock: 100,
    thumbnail: "/products/kawasakilight500.jpg",
    description:
      "Kawasaki Light 500 là dây cước giá rẻ nhất, dành cho người mới hoặc muốn thay dây thử nghiệm. Chất lượng cơ bản, phù hợp tập luyện nhẹ.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.72mm" },
      { key: "Lực căng khuyến nghị", value: "18–22 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Nhập môn" },
      { key: "Phù hợp", value: "Người mới" },
    ],
  },
  {
    name: "Kawasaki Turbo 77",
    slug: "kawasaki-turbo-77",
    brand: "Kawasaki",
    price: 95000,
    stock: 85,
    thumbnail: "/products/kawasakiturbo77.jpg",
    description:
      "Kawasaki Turbo 77 là dây cước tầm trung của Kawasaki, phù hợp người chơi phong trào muốn cân bằng giữa lực và tốc độ. Đường kính 0.68mm, bền vừa phải.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.68mm" },
      { key: "Lực căng khuyến nghị", value: "20–26 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Cân bằng" },
      { key: "Phù hợp", value: "Phong trào – Bán chuyên" },
    ],
  },
  {
    name: "Apacs Ziggler String",
    slug: "apacs-ziggler-string",
    brand: "Apacs",
    price: 90000,
    stock: 90,
    thumbnail: "/products/apacsziggler.jpg",
    description:
      "Apacs Ziggler là dây cước tầm trung của Apacs, mỏng vừa, cho cảm giác đánh ổn định. Phù hợp người chơi phong trào thường xuyên thay dây.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.68mm" },
      { key: "Lực căng khuyến nghị", value: "20–26 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Cân bằng" },
      { key: "Phù hợp", value: "Phong trào" },
    ],
  },
  {
    name: "Kawasaki Precision String 88",
    slug: "kawasaki-precision-string-88",
    brand: "Kawasaki",
    price: 100000,
    stock: 88,
    thumbnail: "/products/kawasakiprecision88.jpg",
    description:
      "Kawasaki Precision 88 là dây cước được thiết kế cho cảm giác kiểm soát tốt, mỏng vừa, phù hợp người chơi kỹ thuật muốn cảm giác cầu rõ ràng hơn.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.67mm" },
      { key: "Lực căng khuyến nghị", value: "21–27 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Kiểm soát" },
      { key: "Phù hợp", value: "Bán chuyên – Kỹ thuật" },
    ],
  },
  {
    name: "Victor Feather String",
    slug: "victor-feather-string",
    brand: "Victor",
    price: 115000,
    stock: 78,
    thumbnail: "/products/vbs68power.jpg",
    description:
      "Victor Feather String là dây cước siêu nhẹ, tốc độ cao, đường kính 0.65mm. Phù hợp tay đôi thi đấu cần tốc độ phản hồi cực nhanh. Bền hơn BG66 Ultimax trong cùng đường kính.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.65mm" },
      { key: "Lực căng khuyến nghị", value: "22–28 lbs" },
      { key: "Cấu trúc", value: "Nano Enhanced" },
      { key: "Cảm giác đánh", value: "Tốc độ cao" },
      { key: "Phù hợp", value: "Tay đôi – Bán chuyên" },
    ],
  },
  {
    name: "Apacs Calibar String",
    slug: "apacs-calibar-string",
    brand: "Apacs",
    price: 95000,
    stock: 82,
    thumbnail: "/products/apacsziggler.jpg",
    description:
      "Apacs Calibar String là dây cước tấn công của Apacs, cứng vừa phải, lực smash tốt trong tầm giá phổ thông. Phù hợp người chơi ưa thích lối đánh tấn công.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.70mm" },
      { key: "Lực căng khuyến nghị", value: "20–26 lbs" },
      { key: "Cấu trúc", value: "Multifilament" },
      { key: "Cảm giác đánh", value: "Lực – Bền" },
      { key: "Phù hợp", value: "Tấn công – Phong trào" },
    ],
  },
  {
    name: "Yonex BG65 Ti",
    slug: "yonex-bg65-ti",
    brand: "Yonex",
    price: 105000,
    stock: 95,
    thumbnail: "/products/bg65.jpg",
    description:
      "Yonex BG65 Ti là phiên bản cải tiến của BG65, thêm Titanium coating tăng độ bền và cứng. Cảm giác đánh tốt hơn BG65 thường, giá chỉ nhỉnh hơn đôi chút. Phù hợp người muốn nâng cấp nhẹ từ BG65.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.70mm" },
      { key: "Lực căng khuyến nghị", value: "20–27 lbs" },
      { key: "Cấu trúc", value: "Titanium Coated" },
      { key: "Cảm giác đánh", value: "Bền – Cứng hơn BG65" },
      { key: "Phù hợp", value: "Phong trào – Bán chuyên" },
    ],
  },
  {
    name: "Victor VBS63 Speed",
    slug: "victor-vbs63-speed",
    brand: "Victor",
    price: 135000,
    stock: 68,
    thumbnail: "/products/vbs66nano.jpg",
    description:
      "Victor VBS63 Speed là dây cước siêu tốc của Victor, đường kính 0.63mm. Cho tốc độ phản hồi cực nhanh, thích hợp cho tay đôi chuyên nghiệp thi đấu cường độ cao.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính", value: "0.63mm" },
      { key: "Lực căng khuyến nghị", value: "24–30 lbs" },
      { key: "Cấu trúc", value: "Ultra Thin Core" },
      { key: "Cảm giác đánh", value: "Tốc độ tối đa" },
      { key: "Phù hợp", value: "Chuyên nghiệp – Tay đôi" },
    ],
  },
  {
    name: "Lining Aerobite Boost",
    slug: "lining-aerobite-boost",
    brand: "Lining",
    price: 150000,
    stock: 58,
    thumbnail: "/products/aerobite.jpg",
    description:
      "Lining Aerobite Boost là dây cước hybrid tốc độ của Li-Ning. Dây dọc dày hơn cho sức mạnh, dây ngang mỏng hơn cho tốc độ, kết hợp tạo ra cảm giác đánh hybrid độc đáo. Phù hợp người chơi kỹ thuật.",
    categorySlug: "day-cuoc",
    specs: [
      { key: "Đường kính dây dọc", value: "0.68mm" },
      { key: "Đường kính dây ngang", value: "0.64mm" },
      { key: "Lực căng khuyến nghị", value: "22–28 lbs" },
      { key: "Cấu trúc", value: "Hybrid" },
      { key: "Cảm giác đánh", value: "Tốc độ – Xoáy" },
      { key: "Phù hợp", value: "Kỹ thuật – Bán chuyên" },
    ],
  },

  // ══════════════════════════════════════════
  // PHỤ KIỆN (20 sản phẩm)
  // ══════════════════════════════════════════
  {
    name: "Yonex Grip AC102",
    slug: "yonex-grip-ac102",
    brand: "Yonex",
    price: 55000,
    stock: 150,
    thumbnail: "/products/gripac102.jpg",
    description:
      "Yonex AC102 là cốt grip chính hãng cao cấp nhất của Yonex, chất liệu PU tổng hợp mềm mịn, thấm mồ hôi tốt. Độ dày 1.8mm giúp cầm vợt chắc hơn. Bán lẻ hoặc theo set 3 cái. Phù hợp thay cốt tay cầm vợt.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Cốt grip (Replacement Grip)" },
      { key: "Chất liệu", value: "PU tổng hợp" },
      { key: "Độ dày", value: "1.8mm" },
      { key: "Chiều dài", value: "100cm" },
      { key: "Màu sắc", value: "Đen / Trắng / Xanh" },
    ],
  },
  {
    name: "Yonex Overgrip Pro",
    slug: "yonex-overgrip-pro",
    brand: "Yonex",
    price: 35000,
    stock: 200,
    thumbnail: "/products/overgrippro.jpg",
    description:
      "Yonex Overgrip Pro là băng quấn tay cầm siêu mỏng (0.6mm), quấn đè lên cốt grip để tăng ma sát và thấm mồ hôi. Bán theo set 3 cuộn. Phổ biến với người chơi phong trào đến chuyên nghiệp.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Overgrip" },
      { key: "Chất liệu", value: "PU siêu mỏng" },
      { key: "Độ dày", value: "0.6mm" },
      { key: "Số lượng", value: "3 cuộn / gói" },
      { key: "Màu sắc", value: "Trắng / Đen / Vàng" },
    ],
  },
  {
    name: "Yonex Towel Grip",
    slug: "yonex-towel-grip",
    brand: "Yonex",
    price: 45000,
    stock: 180,
    thumbnail: "/products/towelgrip.jpg",
    description:
      "Yonex Towel Grip là cốt grip vải khăn, thấm hút mồ hôi cực tốt, phù hợp người ra mồ hôi tay nhiều. Cảm giác cầm mềm hơn PU grip. Cần thay thường xuyên hơn do dễ bám bẩn.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Towel Grip" },
      { key: "Chất liệu", value: "Vải khăn bông" },
      { key: "Độ dày", value: "2.5mm" },
      { key: "Chiều dài", value: "100cm" },
      { key: "Màu sắc", value: "Trắng" },
    ],
  },
  {
    name: "Yonex Wristband",
    slug: "yonex-wristband",
    brand: "Yonex",
    price: 80000,
    stock: 120,
    thumbnail: "/products/wristbandyonex.jpg",
    description:
      "Yonex Wristband chính hãng, vải cotton thấm mồ hôi tốt, giữ cổ tay ấm và hỗ trợ khi đánh. Bán theo cặp 2 chiếc. Phù hợp thi đấu hoặc tập luyện cường độ cao.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Băng cổ tay" },
      { key: "Chất liệu", value: "Cotton + Spandex" },
      { key: "Kích thước", value: "One size (điều chỉnh được)" },
      { key: "Số lượng", value: "2 chiếc / cặp" },
      { key: "Màu sắc", value: "Trắng / Đen / Xanh" },
    ],
  },
  {
    name: "Yonex Headband",
    slug: "yonex-headband",
    brand: "Yonex",
    price: 70000,
    stock: 130,
    thumbnail: "/products/headbandyonex.jpg",
    description:
      "Yonex Headband giữ tóc và thấm mồ hôi trán trong thi đấu. Vải cotton mềm, co giãn tốt. Không trượt, không gây khó chịu khi đội lâu. Phù hợp tất cả người chơi.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Băng đầu" },
      { key: "Chất liệu", value: "Cotton + Spandex" },
      { key: "Kích thước", value: "One size" },
      { key: "Màu sắc", value: "Trắng / Đen / Đỏ" },
    ],
  },
  {
    name: "Yonex Shuttlecock AS-50",
    slug: "yonex-shuttlecock-as50",
    brand: "Yonex",
    price: 650000,
    stock: 40,
    thumbnail: "/products/shuttlecockas50.jpg",
    description:
      "Yonex Aerosensa 50 (AS-50) là cầu lông lông vũ cao cấp nhất của Yonex, sử dụng lông vũ ngỗng trắng tự nhiên 16 lông. Bay ổn định, cảm giác đánh cực kỳ chân thực. Được sử dụng trong thi đấu quốc tế. Bán theo hộp 12 quả.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại cầu", value: "Lông vũ tự nhiên" },
      { key: "Vật liệu", value: "Lông ngỗng trắng 16 lông" },
      { key: "Tốc độ", value: "76 / 77 / 78 (lựa chọn)" },
      { key: "Số lượng", value: "12 quả / hộp" },
      { key: "Phù hợp", value: "Thi đấu chuyên nghiệp" },
    ],
  },
  {
    name: "Ashaway Overgrip",
    slug: "ashaway-overgrip",
    brand: "Apacs",
    price: 30000,
    stock: 220,
    thumbnail: "/products/ashawaygrip.jpg",
    description:
      "Overgrip Ashaway là băng quấn tay cầm giá rẻ, thấm mồ hôi tốt. Bán theo set 3 cuộn. Phù hợp người chơi phong trào thay grip thường xuyên, tiết kiệm chi phí.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Overgrip" },
      { key: "Chất liệu", value: "PU" },
      { key: "Độ dày", value: "0.7mm" },
      { key: "Số lượng", value: "3 cuộn / gói" },
      { key: "Màu sắc", value: "Trắng / Xanh" },
    ],
  },
  {
    name: "Yonex Racket Cover",
    slug: "yonex-racket-cover",
    brand: "Yonex",
    price: 120000,
    stock: 60,
    thumbnail: "/products/racketcover.jpg",
    description:
      "Bao vợt Yonex đơn chính hãng, chất liệu polyester dày bảo vệ vợt khỏi va đập nhẹ và bụi bẩn. Có dây kéo tiện lợi. Phù hợp bảo quản vợt khi không dùng hoặc mang đi lại.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Bao vợt đơn" },
      { key: "Chất liệu", value: "Polyester dày" },
      { key: "Kích thước", value: "Vừa mọi loại vợt cầu lông" },
      { key: "Màu sắc", value: "Đen / Trắng" },
    ],
  },
  {
    name: "Máy Căng Cước Clipping Tool",
    slug: "may-cang-cuoc-clipping-tool",
    brand: "Apacs",
    price: 350000,
    stock: 30,
    thumbnail: "/products/stringingtool.jpg",
    description:
      "Bộ dụng cụ hỗ trợ căng cước cầu lông cho người tự căng tại nhà. Bao gồm kẹp cước, dao cắt, và hướng dẫn sử dụng. Giúp tiết kiệm chi phí căng cước ở tiệm cho người chơi thường xuyên.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Dụng cụ căng cước" },
      { key: "Bao gồm", value: "Kẹp cước + dao cắt + hướng dẫn" },
      { key: "Phù hợp", value: "Tự căng tại nhà" },
    ],
  },
  {
    name: "Victor Training Band",
    slug: "victor-training-band",
    brand: "Victor",
    price: 180000,
    stock: 50,
    thumbnail: "/products/trainingband.jpg",
    description:
      "Victor Training Band là dây kháng lực dùng để tập luyện cơ tay và cơ chân cho cầu lông. Tăng sức mạnh swing, cải thiện phản xạ và bứt tốc. Độ kháng lực vừa phải, phù hợp tập luyện hằng ngày.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Dây kháng lực tập luyện" },
      { key: "Chất liệu", value: "Latex tự nhiên" },
      { key: "Độ kháng lực", value: "Trung bình (15–25 lbs)" },
      { key: "Chiều dài", value: "120cm" },
      { key: "Phù hợp", value: "Tập sức mạnh – Cầu lông" },
    ],
  },
  {
    name: "Yonex Grip AC102 Xanh",
    slug: "yonex-grip-ac102-xanh",
    brand: "Yonex",
    price: 55000,
    stock: 140,
    thumbnail: "/products/gripac102.jpg",
    description:
      "Yonex AC102 màu xanh dành cho người thích màu sắc nổi bật. Cùng chất lượng PU cao cấp, thấm mồ hôi tốt, độ dày 1.8mm. Thay thế cốt grip khi cốt cũ bị mòn hoặc hôi.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Cốt grip (Replacement Grip)" },
      { key: "Chất liệu", value: "PU tổng hợp" },
      { key: "Độ dày", value: "1.8mm" },
      { key: "Chiều dài", value: "100cm" },
      { key: "Màu sắc", value: "Xanh" },
    ],
  },
  {
    name: "Victor Overgrip Set",
    slug: "victor-overgrip-set",
    brand: "Victor",
    price: 38000,
    stock: 190,
    thumbnail: "/products/overgrippro.jpg",
    description:
      "Victor Overgrip Set gồm 3 cuộn overgrip chất lượng tốt, thấm mồ hôi và chống trơn trượt. Phù hợp người chơi phong trào đến bán chuyên thay grip định kỳ.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Overgrip" },
      { key: "Chất liệu", value: "PU mỏng" },
      { key: "Độ dày", value: "0.6mm" },
      { key: "Số lượng", value: "3 cuộn / gói" },
      { key: "Màu sắc", value: "Trắng / Đen" },
    ],
  },
  {
    name: "Cầu Lông Lông Vũ Victor",
    slug: "cau-long-long-vu-victor",
    brand: "Victor",
    price: 520000,
    stock: 45,
    thumbnail: "/products/shuttlecockas50.jpg",
    description:
      "Cầu lông lông vũ Victor chất lượng tốt, sử dụng trong tập luyện và thi đấu phong trào. Lông vũ tự nhiên, đường bay ổn định, độ bền tốt trong tầm giá. Bán theo hộp 12 quả.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại cầu", value: "Lông vũ tự nhiên" },
      { key: "Tốc độ", value: "76 / 77 / 78" },
      { key: "Số lượng", value: "12 quả / hộp" },
      { key: "Phù hợp", value: "Phong trào – Thi đấu" },
    ],
  },
  {
    name: "Yonex Wristband Đen",
    slug: "yonex-wristband-den",
    brand: "Yonex",
    price: 80000,
    stock: 110,
    thumbnail: "/products/wristbandyonex.jpg",
    description:
      "Yonex Wristband màu đen thấm hút mồ hôi tốt, thiết kế thanh lịch. Bán theo cặp 2 chiếc. Phù hợp thi đấu hoặc tập luyện cường độ cao.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Băng cổ tay" },
      { key: "Chất liệu", value: "Cotton + Spandex" },
      { key: "Kích thước", value: "One size" },
      { key: "Số lượng", value: "2 chiếc / cặp" },
      { key: "Màu sắc", value: "Đen" },
    ],
  },
  {
    name: "Lining Towel Grip",
    slug: "lining-towel-grip",
    brand: "Lining",
    price: 48000,
    stock: 160,
    thumbnail: "/products/towelgrip.jpg",
    description:
      "Lining Towel Grip là cốt grip vải khăn của Li-Ning, thấm mồ hôi tốt, cảm giác cầm mềm mại. Phù hợp người ra mồ hôi tay nhiều hoặc thích cảm giác vải hơn PU.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Towel Grip" },
      { key: "Chất liệu", value: "Vải khăn bông" },
      { key: "Độ dày", value: "2.5mm" },
      { key: "Chiều dài", value: "100cm" },
      { key: "Màu sắc", value: "Trắng / Xanh" },
    ],
  },
  {
    name: "Kawasaki Shuttlecock Nylon",
    slug: "kawasaki-shuttlecock-nylon",
    brand: "Kawasaki",
    price: 120000,
    stock: 60,
    thumbnail: "/products/shuttlecockas50.jpg",
    description:
      "Cầu lông nylon Kawasaki bền bỉ, phù hợp tập luyện ngoài trời hoặc sàn thể chất. Chịu được điều kiện thời tiết khác nhau, bay ổn định. Tiết kiệm chi phí hơn cầu lông vũ. Bán theo hộp 12 quả.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại cầu", value: "Nylon nhân tạo" },
      { key: "Tốc độ", value: "76 / 77 / 78" },
      { key: "Số lượng", value: "12 quả / hộp" },
      { key: "Phù hợp", value: "Tập luyện – Ngoài trời" },
    ],
  },
  {
    name: "Bao Vợt Victor",
    slug: "bao-vot-victor",
    brand: "Victor",
    price: 95000,
    stock: 70,
    thumbnail: "/products/racketcover.jpg",
    description:
      "Bao vợt đơn Victor bảo vệ vợt khỏi trầy xước và bụi bẩn. Chất liệu polyester nhẹ, có khoá kéo tiện lợi. Phù hợp bảo quản vợt cao cấp.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Bao vợt đơn" },
      { key: "Chất liệu", value: "Polyester" },
      { key: "Kích thước", value: "Vừa mọi vợt cầu lông" },
      { key: "Màu sắc", value: "Đen / Xanh" },
    ],
  },
  {
    name: "Headband Victor",
    slug: "headband-victor",
    brand: "Victor",
    price: 65000,
    stock: 120,
    thumbnail: "/products/headbandyonex.jpg",
    description:
      "Headband Victor giữ tóc và thấm mồ hôi khi thi đấu. Vải co giãn, không trượt, màu sắc đa dạng. Thương hiệu Victor quen thuộc với người chơi cầu lông Việt Nam.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Băng đầu" },
      { key: "Chất liệu", value: "Cotton + Spandex" },
      { key: "Kích thước", value: "One size" },
      { key: "Màu sắc", value: "Trắng / Đen / Xanh" },
    ],
  },
  {
    name: "Kawasaki Grip Set",
    slug: "kawasaki-grip-set",
    brand: "Kawasaki",
    price: 28000,
    stock: 200,
    thumbnail: "/products/gripac102.jpg",
    description:
      "Kawasaki Grip Set là bộ overgrip giá rẻ nhất thị trường, gồm 3 cuộn. Phù hợp người chơi phong trào thay grip thường xuyên hoặc người mới chưa muốn đầu tư nhiều.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Overgrip" },
      { key: "Chất liệu", value: "PU mỏng" },
      { key: "Số lượng", value: "3 cuộn / gói" },
      { key: "Màu sắc", value: "Trắng / Đen" },
    ],
  },
  {
    name: "Yonex Training Resistance Band",
    slug: "yonex-training-resistance-band",
    brand: "Yonex",
    price: 220000,
    stock: 45,
    thumbnail: "/products/trainingband.jpg",
    description:
      "Yonex Training Resistance Band là dây kháng lực chính hãng Yonex, thiết kế đặc biệt cho tập luyện cầu lông. Cải thiện sức mạnh swing và tốc độ phản xạ. Bộ gồm 2 mức kháng lực khác nhau.",
    categorySlug: "phu-kien",
    specs: [
      { key: "Loại", value: "Dây kháng lực" },
      { key: "Chất liệu", value: "Latex cao cấp" },
      { key: "Độ kháng lực", value: "Nhẹ (10–15 lbs) + Trung bình (20–25 lbs)" },
      { key: "Số lượng", value: "2 dây / bộ" },
      { key: "Phù hợp", value: "Tập luyện nâng cao" },
    ],
  },
];

// ─────────────────────────────────────────────
// REVIEWS MẪU THEO TỪNG LOẠI SẢN PHẨM
// ─────────────────────────────────────────────
const reviewsByCategory: Record<
  string,
  Array<{ name: string; rating: number; comment: string }>
> = {
  "vot-cau-long": [
    {
      name: "Nguyễn Văn Hùng",
      rating: 5,
      comment:
        "Vợt đánh rất đầm, smash xuyên phá tốt. Xứng đáng với tầm giá!",
    },
    {
      name: "Trần Minh Tuấn",
      rating: 4,
      comment:
        "Chất lượng tốt, cảm giác cầm cân bằng. Giao hàng nhanh, đóng gói cẩn thận.",
    },
  ],
  "giay-cau-long": [
    {
      name: "Lê Thị Hoa",
      rating: 5,
      comment:
        "Đế êm, ôm chân tốt, không đau bàn chân dù chơi 2 tiếng. Rất hài lòng!",
    },
    {
      name: "Phạm Đức Long",
      rating: 4,
      comment: "Nhẹ, chống trơn tốt. Size đúng chuẩn, đặt đúng size là được.",
    },
  ],
  "tui-cau-long": [
    {
      name: "Ngô Thị Mai",
      rating: 5,
      comment:
        "Túi rộng, chứa đủ đồ, chất liệu dày dặn. Thiết kế đẹp, màu sắc xịn.",
    },
    {
      name: "Đỗ Văn Nam",
      rating: 4,
      comment: "Mua cho con trai dùng, cháu rất thích. Chất lượng ổn trong tầm giá.",
    },
  ],
  "day-cuoc": [
    {
      name: "Bùi Văn Khánh",
      rating: 5,
      comment:
        "Cước bền, căng xong cảm giác đánh rất chuẩn. Sẽ mua lại lần sau.",
    },
    {
      name: "Hoàng Thị Lan",
      rating: 4,
      comment:
        "Cước tốt trong tầm giá. Thấm dây 25 lbs vẫn giữ căng sau 2 tuần chơi.",
    },
  ],
  "phu-kien": [
    {
      name: "Vũ Minh Quang",
      rating: 5,
      comment:
        "Phụ kiện chính hãng, chất lượng như kỳ vọng. Giao hàng nhanh, có tem chống hàng giả.",
    },
    {
      name: "Đinh Thị Thu",
      rating: 4,
      comment:
        "Dùng tốt, đúng hàng. Giá hơi cao hơn chợ nhưng yên tâm chính hãng.",
    },
  ],
};

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  // Xoá dữ liệu cũ
  await prisma.review.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🗑️  Đã xoá dữ liệu cũ");

  // Tạo categories
  const categoryData = [
    { name: "Vợt cầu lông", slug: "vot-cau-long" },
    { name: "Giày cầu lông", slug: "giay-cau-long" },
    { name: "Túi cầu lông", slug: "tui-cau-long" },
    { name: "Dây cước", slug: "day-cuoc" },
    { name: "Phụ kiện", slug: "phu-kien" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoryData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
    console.log(`📁 Tạo danh mục: ${cat.name}`);
  }

  // Tạo products
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const categoryId = categoryMap[p.categorySlug];

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        price: p.price,
        stock: p.stock,
        thumbnail: p.thumbnail,
        description: p.description.trim(),
        categoryId,
      },
    });

    // Thông số kỹ thuật
    await prisma.productSpecification.createMany({
      data: p.specs.map((s) => ({
        productId: product.id,
        key: s.key,
        value: s.value,
      })),
    });

    // Đánh giá
    const reviews = reviewsByCategory[p.categorySlug];
    await prisma.review.createMany({
      data: reviews.map((r) => ({
        productId: product.id,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
      })),
    });

    console.log(`✅ [${i + 1}/100] ${p.name} — ${p.price.toLocaleString("vi-VN")}đ`);
  }

  console.log("\n🎉 Seed hoàn tất! Tổng cộng 100 sản phẩm.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
