/**
 * S3 Utility Module
 * -----------------
 * Handles all interactions with AWS S3:
 * - Generating pre-signed upload URLs for temporary storage
 * - Moving uploaded objects from the temporary to permanent bucket
 */

import AWS from "aws-sdk";
import validatedEnv from "./envSchema.js";

const { S3 } = AWS;

// Destructure and validate required environment variables
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_TEMP_BUCKET_NAME,
  AWS_PREM_BUCKET_NAME,
} = validatedEnv;

// Initialize S3 client using secure credentials
const s3 = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generate a pre-signed URL for uploading files to the temporary S3 bucket.
 * - The file will initially be stored under the "pending/" prefix.
 * - URL is valid for 5 minutes (300 seconds).
 *
 * @param filename - Original name of the file to upload.
 * @param contentType - MIME type of the file (e.g., "image/png").
 * @returns Object containing:
 *   - `url`: The pre-signed URL for direct client upload.
 *   - `key`: The S3 object key where the file will be stored.
 */
async function generateUploadUrl(
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  if (!AWS_TEMP_BUCKET_NAME) {
    throw new Error("❌ Missing AWS_TEMP_BUCKET_NAME in environment variables");
  }

  // Generate a unique file key in the temporary bucket
  const key = `pending/${Date.now()}_${filename}`;

  try {
    // Create a pre-signed URL for uploading directly to S3
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: AWS_TEMP_BUCKET_NAME,
      Key: key,
      Expires: 300, // 5 minutes
      ContentType: contentType,
    });

    return { url, key };
  } catch (error) {
    console.error("❌ Error generating S3 signed URL:", error);
    throw new Error("Failed to generate S3 upload URL");
  }
}

/**
 * Move a file from the temporary S3 bucket to the permanent public bucket.
 * - Copies the file from `pending/` → `public/` path.
 * - Makes the file publicly readable.
 * - Returns the public URL of the moved file.
 *
 * @param key - The original key (path) of the uploaded object in the temp bucket.
 * @returns The public S3 URL of the moved file.
 */
async function moveObjectToPermanentBucket(key: string): Promise<string> {
  if (!AWS_TEMP_BUCKET_NAME || !AWS_PREM_BUCKET_NAME) {
    throw new Error("Bucket names are not defined in environment variables");
  }

  // Compute the new key path (publicly accessible version)
  const newKey = key.replace("pending/", "public/");

  try {
    // Step 1: Copy object from temp → permanent bucket
    await s3
      .copyObject({
        CopySource: `${AWS_TEMP_BUCKET_NAME}/${key}`,
        Bucket: AWS_PREM_BUCKET_NAME,
        Key: newKey,
      })
      .promise();

    // Step 2: Return the public URL of the file
    return `https://${AWS_PREM_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${newKey}`;
  } catch (error) {
    console.error(" Error moving object to permanent bucket:", error);
    throw new Error("Failed to move object to permanent bucket");
  }
}

/**
 * Exported utility methods
 */
export {
  generateUploadUrl,
  moveObjectToPermanentBucket,
};
