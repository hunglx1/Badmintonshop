import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export class PayloadTooLargeError extends Error {}

let callsSinceCleanup = 0;

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<unknown> {
  const reader = request.body?.getReader();

  if (!reader) {
    throw new SyntaxError("Request body is empty");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError("Request body is too large");
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body));
}

export function getRateLimitKey(request: Request, namespace: string) {
  const headers = new Headers(request.headers);
  const ip =
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const digest = createHash("sha256").update(ip).digest("hex");

  return `${namespace}:${digest}`;
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const resetAt = new Date(Date.now() + windowMs);
  const rows = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO "ApiRateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "ApiRateLimit"."resetAt" <= NOW() THEN 1
        ELSE "ApiRateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "ApiRateLimit"."resetAt" <= NOW() THEN ${resetAt}
        ELSE "ApiRateLimit"."resetAt"
      END
    RETURNING "count", "resetAt"
  `;

  callsSinceCleanup += 1;
  if (callsSinceCleanup >= 100) {
    callsSinceCleanup = 0;
    await prisma.apiRateLimit.deleteMany({
      where: { resetAt: { lt: new Date() } },
    });
  }

  return {
    allowed: rows[0].count <= limit,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((rows[0].resetAt.getTime() - Date.now()) / 1000)
    ),
  };
}
