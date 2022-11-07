import express, { Express } from "express";
import cors from "cors";
import userRouter from "./user";
import eventRouter from "./event";

export const router = (app: Express): void => {
  app.use(express.json());
  app.use(cors());
  app.use("/user", userRouter);
  app.use("/event", eventRouter);
};
