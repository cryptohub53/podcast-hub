import { vi, beforeEach } from "vitest";

// Set test environment first
process.env.NODE_ENV = "test";

// Mock environment variables for testing
process.env.PORT = "3000";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.AWS_ACCESS_KEY_ID = "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
process.env.AWS_TEMP_BUCKET_NAME = "test-temp-bucket";
process.env.AWS_PREM_BUCKET_NAME = "test-perm-bucket";
process.env.AWS_REGION = "us-east-1";

// Mock AWS SDK completely to prevent any real AWS calls
vi.mock("aws-sdk", () => ({
  S3: vi.fn().mockImplementation(() => ({
    getSignedUrl: vi.fn().mockReturnValue("https://s3.amazonaws.com/fakebucket/fakefile.mp3"),
    copyObject: vi.fn().mockReturnValue({
      promise: vi.fn().mockResolvedValue({}),
    }),
    deleteObject: vi.fn().mockReturnValue({
      promise: vi.fn().mockResolvedValue({}),
    }),
  })),
  config: {
    update: vi.fn(),
  },
}));

// Mock AWS utilities
vi.mock("../utils/aws", () => ({
  generateUploadUrl: vi.fn().mockResolvedValue({
    url: "https://s3.amazonaws.com/fakebucket/fakefile.mp3",
    key: "pending/fake-key",
  }),
  moveObjectToPermanentBucket: vi.fn().mockImplementation((key: string) =>
    Promise.resolve(`https://example.com/perm/${key}`)
  ),
}));

// Mock environment validation to prevent startup errors
vi.mock("../utils/envSchema", () => ({
  default: {
    PORT: 3000,
    NODE_ENV: "test",
    FRONTEND_URL: "http://localhost:3000",
    MONGODB_URI: "mongodb://localhost:27017/test",
    AWS_ACCESS_KEY_ID: "test-access-key",
    AWS_SECRET_ACCESS_KEY: "test-secret-key",
    AWS_TEMP_BUCKET_NAME: "test-temp-bucket",
    AWS_PREM_BUCKET_NAME: "test-perm-bucket",
    AWS_REGION: "us-east-1",
  },
}));

// Mock mongoose connection
vi.mock("mongoose", async () => {
  const actual = await vi.importActual("mongoose");
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue({}),
    startSession: vi.fn().mockResolvedValue({
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      abortTransaction: vi.fn(),
      endSession: vi.fn(),
    }),
  };
});

// Global test setup
beforeEach(() => {
  vi.clearAllMocks();
});
