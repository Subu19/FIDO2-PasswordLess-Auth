import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  username: { type: String },
  credential: { type: Object },
});

export default mongoose.model("User", userModel);
