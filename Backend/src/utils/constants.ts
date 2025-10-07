// User Types Enum
enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Podcast Types Enum
enum PodcastCategory {
  TECHNOLOGY = "Technology",
  EDUCATION = "Education",
  HEALTH = "Health",
  BUSINESS = "Business",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other",
}

enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Constants object i.e read only status
const Constants = {
  UserRole,
  PodcastCategory,
  Status,
} as const;

export default Constants;
