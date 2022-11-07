import jwt from "jsonwebtoken";
import express from "express";
import config from "../config";

interface Token {
  userId: string;
  iat: number;
  exp: number;
}
const authRouter = express.Router();

authRouter.use((req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).send({ message: "TOKEN NOT GOOD" });
    const decodedToken = jwt.verify(token, config.randomTokenSecret);
    if (!decodedToken)
      return res.status(400).send({ message: "TOKEN NOT GOOD" });
    const userId = (decodedToken as Token).userId;
    req.body.auth = {
      userId: userId,
    };
    next();
  } catch (e) {
    res.status(401).send({ message: "INTERNAL SERVER ERROR" });
  }
});
export default authRouter;
