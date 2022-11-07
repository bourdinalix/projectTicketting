import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import UserDB, { User, UserSchema } from "../models/user.model";

export const getUsers = async (): Promise<UserSchema[] | null> => {
  const users = await UserDB.find({});
  if (!users) return null;
  return users;
};

export const getUserByEmail = async (
  data: Pick<User, "email">
): Promise<UserSchema | null> => {
  const user = await UserDB.findOne({ email: data.email });
  if (!user) return null;
  return user;
};

export const getUser = async (
  data: Pick<User, "id">
): Promise<UserSchema | null> => {
  const user = await UserDB.findById(data.id);
  if (!user) return null;
  return user;
};

export const addUser = async (
  data: Omit<User, "id">
): Promise<UserSchema | null> => {
  const existingUser = await UserDB.findOne({ email: data.email });
  if (existingUser) {
    return null;
  }
  const newUser = await UserDB.create(data);
  return newUser;
};

export const userLogin = async (
  data: Pick<User, "email" | "password">
): Promise<string | null> => {
  const existingUser = await UserDB.findOne({ email: data.email });
  if (!existingUser) return null;
  const isValid = bcrypt.compare(data.password, existingUser.password);
  if (!isValid) return null;
  const token = jwt.sign(
    { userId: existingUser._id },
    config.randomTokenSecret,
    {
      expiresIn: "6h",
    }
  );
  return token;
};
