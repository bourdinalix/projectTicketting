import mongoose from "mongoose";
import config from "../config";

export const setConnection = (): void => {
  mongoose.connect(config.mongoPath);
};
