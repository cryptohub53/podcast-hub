import mongoose, { Document, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import Constants from "../utils/constants";
import { EpisodeDocument } from "./episode";
import { UserDocument } from "./user";


// Interface for Podcast document
export interface PodcastDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  author: string;
  category: typeof Constants.PodcastCategory[keyof typeof Constants.PodcastCategory];
  coverImageUrl?: string;
  episodes: Types.ObjectId[] & EpisodeDocument[];
  followers: Types.ObjectId[] & UserDocument[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Podcast input (without auto-generated fields)
export interface PodcastInput {
  title: string;
  description: string;
  author: string;
  category?: typeof Constants.PodcastCategory[keyof typeof Constants.PodcastCategory];
  coverImageUrl?: string;
  episodes?: Types.ObjectId[] & EpisodeDocument[];
  followers?: Types.ObjectId[] & UserDocument[];
}

// Podcast Schema
const podcastSchema = new Schema<PodcastDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters long"],
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      enum: Object.values(Constants.PodcastCategory),
      default: Constants.PodcastCategory.OTHER,
    },
    coverImageUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/i.test(v);
        },
        message: "Cover image URL must be a valid image URL",
      },
    },
    episodes: [
      {
        type: Schema.Types.ObjectId ,
        ref: "Episode",
        default: [],
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    status: {
      type: String,
      enum: Object.values(Constants.Status),
      default: Constants.Status.PENDING,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for episode count
podcastSchema.virtual('episodeCount').get(function() {
  return this.episodes?.length ?? 0;
});

// Virtual for follower count
podcastSchema.virtual('followerCount').get(function() {
  return this.followers?.length ?? 0;
});

// Indexes for better performance
podcastSchema.index({ title: 'text', description: 'text', author: 'text' });
podcastSchema.index({ category: 1 });
podcastSchema.index({ author: 1 });
podcastSchema.index({ createdAt: -1 });

// Add pagination plugin
podcastSchema.plugin(mongoosePaginate);

export const Podcast = mongoose.model<PodcastDocument, PaginateModel<PodcastDocument>>("Podcast", podcastSchema);
