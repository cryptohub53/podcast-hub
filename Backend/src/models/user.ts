import mongoose, { Document, Schema, Types } from "mongoose";
import { UserRole } from "../utils/constants";

// Interface for User document
export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  favorites: Types.ObjectId[];
  recentlyPlayed: Types.ObjectId[];
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User input (without auto-generated fields)
export interface UserInput {
  name: string;
  email: string;
  password: string;
  favorites?: Types.ObjectId[];
  recentlyPlayed?: Types.ObjectId[];
  avatarUrl?: string;
  role?: UserRole;
}

// User Schema
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Podcast",
        default: [],
      },
    ],
    recentlyPlayed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Episode",
        default: [],
      },
    ],
    avatarUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/i.test(v);
        },
        message: "Avatar URL must be a valid image URL",
      },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { 
    // Adds createdAt and updatedAt automatically
    timestamps: true,

    // Change how the data looks when sent as JSON (like in API responses)
    toJSON: {
      transform: function(doc, ret) {

        // Remove password before sending data
        delete (ret as any).password;
        return ret; // Return the cleaned object
      }
    }
  }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
