import mongoose from "../lib/db";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionToken: { type: String, default: "" },
  premium: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
