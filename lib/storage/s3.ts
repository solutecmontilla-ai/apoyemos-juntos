import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

let cached: S3Client | null = null;

function getClient() {
  if (cached) return cached;

  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Variables de entorno S3_* no configuradas");
  }

  cached = new S3Client({
    endpoint,
    region: process.env.S3_REGION || "us-east-1",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // requerido por MinIO
  });
  return cached;
}

function getBucket() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET no está configurado");
  return bucket;
}

export async function subirArchivo(key: string, buffer: Buffer, contentType: string) {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return { key };
}

export async function obtenerArchivo(key: string) {
  const client = getClient();
  const result = await client.send(
    new GetObjectCommand({ Bucket: getBucket(), Key: key })
  );
  return {
    stream: result.Body?.transformToWebStream(),
    contentType: result.ContentType ?? "application/octet-stream",
  };
}

export async function eliminarArchivo(key: string) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}
