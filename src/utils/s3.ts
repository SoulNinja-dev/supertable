import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env.mjs";

// a client can be shared by different commands.
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESSKEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function generatePresignedUrl(
  fileName: string,
  type: string
): Promise<string> {
  const key = `${type}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: "supertable",
    Key: key,
    ContentType: "binary/octet-stream",
    // ACL: 'public-read', // Add this line
  });

  const presignedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 2, // The URL will be valid for 2 minutes
  });

  return presignedUrl;
}
