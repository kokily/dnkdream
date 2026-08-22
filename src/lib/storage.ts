import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
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

function publicBase() {
  return (process.env.S3_PUBLIC_URL ?? "").replace(/\/$/, "");
}

function keyFromUrl(url: string) {
  const cleaned = url.replace(/[.,;]+$/, "");

  if (cleaned.startsWith("/uploads/")) {
    return cleaned.slice("/uploads/".length);
  }

  const base = publicBase();
  if (base && cleaned.startsWith(`${base}/`)) {
    return cleaned.slice(base.length + 1);
  }

  return null;
}

export function imageKeysFromPost(thumbnail: string | null, body: string) {
  const keys = new Set<string>();
  const pattern = /https?:\/\/[^\s)"'\\]+|\/uploads\/[^\s)"'\\]+/g;

  for (const text of [thumbnail ?? "", body]) {
    for (const match of text.matchAll(pattern)) {
      const key = keyFromUrl(match[0]);
      if (key && !key.includes("..") && !key.startsWith("/")) {
        keys.add(key);
      }
    }
  }

  return [...keys];
}

export async function deleteImages(keys: string[]) {
  if (keys.length === 0) return;

  if (process.env.S3_BUCKET) {
    const { DeleteObjectsCommand, S3Client } =
      await import("@aws-sdk/client-s3");
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION ?? "ap-northeast-2";

    await new S3Client({ region }).send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
          Quiet: true,
        },
      }),
    );
    return;
  }

  await Promise.all(
    keys.map((key) =>
      unlink(path.join(process.cwd(), "public", "uploads", key)).catch(
        () => {},
      ),
    ),
  );
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
