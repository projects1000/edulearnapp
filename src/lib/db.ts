// Example: MongoDB connection using mongoose
import mongoose from "mongoose";


// Use cloud MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://githubprojects100_db_user:spwUzLeiOhYs4itf@cluster0.q4jcx17.mongodb.net/?appName=Cluster0";

// For local MongoDB, use:
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edulearnapp";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI);
}

export default mongoose;
