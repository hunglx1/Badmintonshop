import { NextResponse } from "next/server";
import type { ProvinceLocation } from "@/types/address";

interface ApiLocationOption {
  code: number;
  name: string;
}

interface ApiProvince extends ApiLocationOption {
  wards?: ApiLocationOption[];
}

const PROVINCES_API_URL = "https://provinces.open-api.vn/api/v2/?depth=2";

function normalizeProvinceName(name: string) {
  return name.replace(/^(Tỉnh|Thành phố)\s+/u, "");
}

export async function GET() {
  try {
    const response = await fetch(PROVINCES_API_URL, {
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Không tải được danh sách tỉnh thành" },
        { status: 502 }
      );
    }

    const source = (await response.json()) as ApiProvince[];
    const locations: ProvinceLocation[] = source.map((province) => ({
      code: province.code,
      name: normalizeProvinceName(province.name),
      wards: (province.wards ?? []).map((ward) => ({
        code: ward.code,
        name: ward.name,
      })),
    }));

    return NextResponse.json(locations, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Không kết nối được nguồn dữ liệu địa chỉ" },
      { status: 502 }
    );
  }
}