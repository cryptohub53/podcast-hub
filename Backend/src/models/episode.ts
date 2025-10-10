import mongoose, { Document, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Interface for Episode document
export interface EpisodeDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  audioKey: string;          // S3 object key in TEMP bucket
  audioUrl?: string;         // Public URL after approval
  duration?: number;         
  podcast: Types.ObjectId;
  publishedAt: Date;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Episode input (without auto-generated fields)
export interface EpisodeInput {
  title: string;
  description?: string;
  audioKey: string;
  duration?: number;
  podcast: Types.ObjectId;
  publishedAt?: Date;
  playCount?: number;
  audioUrl?: string;
}

// Episode Schema
const episodeSchema = new Schema<EpisodeDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    audioKey: {
      type: String, // S3 object key 
      required: [true, "Audio key is required"],
      validate: {
        validator: function (v: string) {
          // Check if the key ends with a valid audio file extension
          return /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(v);
        },
        message: "Audio key must point to a valid audio file",
      },
    },
    audioUrl: {
      type: String, // Public URL after approval
      validate: {
        validator: function (v: string) {
          if (!v) return true; // allow empty until approved
          return /^https?:\/\/.+/.test(v);
        },
        message: "Audio URL must be a valid URL",
      },
    },
    duration: {
      type: Number, // in seconds
      default: 0,
      min: [0, "Duration cannot be negative"],
      max: [86400, "Duration cannot exceed 24 hours"], // 24 hours in seconds
    },
    podcast: {
      type: Schema.Types.ObjectId,
      ref: "Podcast",
      required: [true, "Podcast reference is required"],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    playCount: {
      type: Number,
      default: 0,
      min: [0, "Play count cannot be negative"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted duration
episodeSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for relative published date
episodeSchema.virtual('publishedAgo').get(function() {
  if (!this.publishedAt) return null;

  const now = new Date();
  const diffMs = now.getTime() - this.publishedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Indexes for better performance
episodeSchema.index({ podcast: 1, publishedAt: -1 });
episodeSchema.index({ title: 'text', description: 'text' });
episodeSchema.index({ publishedAt: -1 });
episodeSchema.index({ playCount: -1 });

// Add pagination plugin
episodeSchema.plugin(mongoosePaginate);

export const Episode = mongoose.model<EpisodeDocument, PaginateModel<EpisodeDocument>>("Episode", episodeSchema);
