import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function assertImageFile(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("jpg, png, gif, webp, avif만 올릴 수 있습니다");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("8MB 이하만 올릴 수 있습니다");
  }
}

export async function saveImage(file: File) {
  assertImageFile(file);

  const ext = EXT[file.type];
  const key = `${new Date().toISOString().slice(0, 10).replaceAll("-", "")}_${crypto.randomUUID()}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  if (process.env.S3_BUCKET) {
    const { PutObjectCommand, S3Client } = await import("@aws-sdk/client-s3");
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION ?? "ap-northeast-2";
    const publicUrl = process.env.S3_PUBLIC_URL ?? `https://${bucket}`;

    await new S3Client({ region }).send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.type,
      }),
    );

    return `${publicUrl}/${key}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), body);

  return `/uploads/${key}`;
}
