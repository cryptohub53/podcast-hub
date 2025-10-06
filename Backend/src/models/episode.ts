import mongoose, { Document, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Interface for Episode document
export interface EpisodeDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: number; // in seconds
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
  audioUrl: string;
  duration?: number;
  podcast: Types.ObjectId;
  publishedAt?: Date;
  playCount?: number;
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
    audioUrl: {
      type: String, // S3 bucket URL or other audio hosting service
      required: [true, "Audio URL is required"],
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(v) || 
                 /^https?:\/\/.+/.test(v); // Allow any HTTPS URL for flexibility
        },
        message: "Audio URL must be a valid audio file URL",
      },
    },
    duration: {
      type: Number, // in seconds,
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
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
