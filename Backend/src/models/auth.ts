import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    provider: String,
    providerAccountId: String,
    type: String,
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
});


export const Account = model("Account", accountSchema);

const sessionSchema = new Schema({
  sessionToken: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expires: Date,
});

export const Session = model("Session", sessionSchema);

const verificationTokenSchema = new Schema({
  identifier: String,
  token: String,
  expires: Date,
});

export const VerificationToken = model("VerificationToken", verificationTokenSchema);
