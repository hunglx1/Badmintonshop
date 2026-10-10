import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "Không tìm thấy file",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result =
      await new Promise<any>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder:
                  "badminton-store",
              },
              (
                error,
                result
              ) => {
                if (error)
                  reject(error);

                resolve(result);
              }
            )
            .end(buffer);
        }
      );

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Upload thất bại",
      },
      {
        status: 500,
      }
    );
  }
}