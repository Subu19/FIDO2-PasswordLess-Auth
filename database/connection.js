import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI;
export const connect = () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
