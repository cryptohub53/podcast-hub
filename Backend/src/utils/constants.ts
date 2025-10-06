// User Types Enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Podcast Types Enum
export enum PodcastCategory {
  TECHNOLOGY = "Technology",
  EDUCATION = "Education",
  HEALTH = "Health",
  BUSINESS = "Business",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other",
}

// Constants object i.e read only status 
export const Constants = {
  UserRole,
  PodcastCategory,
} as const; 

export default Constants;
