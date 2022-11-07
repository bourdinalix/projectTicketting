import bcrypt from "bcrypt";
import express from "express";
import { addUser, getUser, userLogin } from "../database/services/user.service";
import authRouter from "../middleware/auth";
import generateQR from "../qrcode/create-qr";

const userRouter = express.Router();
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await getUser({
      id: req.params.id,
    });
    if (!user) return res.status(404).send({ message: "USER NOT FOUND" });
  } catch (e) {
    console.log("failed to get user", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});
userRouter.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await addUser({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });
    if (!user) return res.status(400).send({ message: "ALREADY EXISTS" });
    res.status(200).json(user.toObject({ getters: true }));
  } catch (e) {
    console.log("failed to add user", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const loginToken = await userLogin({
      email: req.body.email,
      password: req.body.password,
    });
    if (!loginToken)
      return res.status(400).send({ message: "WRONG CREDENTIALS" });
    return res.status(200).json(loginToken);
  } catch (e) {
    console.log("failed to add user", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

userRouter.post("/qrcode", authRouter, async (req, res) => {
  try {
    if (!req.body.userName || !req.body.eventName)
      return res.status(400).send({ message: "BAD REQUEST" });
    const qrInfos = `${req.body.userName}${req.body.eventName}`;
    const qrCode = await generateQR(qrInfos);
    if (!qrCode)
      return res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    return res.status(200).json(qrCode);
  } catch (e) {
    console.log("failed to create qr for event", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});
export default userRouter;
