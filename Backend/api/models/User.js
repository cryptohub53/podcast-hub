import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 'google', 'github', 'local'
  id: { type: String },                   // OAuth provider ID
  profileUrl: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, lowercase: true, unique: true },
  passwordHash: { type: String },         // for local auth only
  avatar: { type: String },               // profile pic from Google/GitHub/local
  providers: [providerSchema],            // linked OAuth providers
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
