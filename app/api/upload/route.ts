import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "API SECRET:",
  process.env.CLOUDINARY_API_SECRET
    ? "OK"
    : "MISSING"
);
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

    console.log(
      "FILE:",
      file.name
    );

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

    console.log(
      "CLOUDINARY:",
      result
    );

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

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