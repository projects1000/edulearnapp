// Example: MongoDB connection using mongoose
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edulearnapp";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI);
}

export default mongoose;
