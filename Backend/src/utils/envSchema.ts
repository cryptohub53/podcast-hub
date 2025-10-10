import zod from "zod";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

// Define schema for environment variables
const envSchema = zod.object({
  // Server configuration
  PORT: zod.string().min(1).max(65535).transform(Number),
  NODE_ENV: zod.string().min(1),
  FRONTEND_URL: zod.string().url(),

  // Database configuration
  MONGODB_URI: zod.string().url(),

  // AWS configuration (conditionally required)
  AWS_ACCESS_KEY_ID: isDev
    ? zod.string().optional()
    : zod.string().min(1, "AWS_ACCESS_KEY_ID is required in non-dev environments"),
  AWS_SECRET_ACCESS_KEY: isDev
    ? zod.string().optional()
    : zod.string().min(1, "AWS_SECRET_ACCESS_KEY is required in non-dev environments"),
  AWS_TEMP_BUCKET_NAME: isDev
    ? zod.string().optional()
    : zod.string().min(1, "AWS_TEMP_BUCKET_NAME is required in non-dev environments"),
  AWS_PREM_BUCKET_NAME: isDev
    ? zod.string().optional()
    : zod.string().min(1, "AWS_PREM_BUCKET_NAME is required in non-dev environments"),
  AWS_REGION: zod.string().min(1, "AWS_REGION is required"),
});

/**
 * Validates the environment variables against the defined schema.
 * Throws an error at startup if any required variable is missing or invalid.
 * @param {NodeJS.ProcessEnv} env - The environment object to validate.
 * @returns {object} The validated environment variables with correct types.
 */
const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error("❌ Invalid environment variables:", validatedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export default validatedEnv.data;
