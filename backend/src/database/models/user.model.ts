import {
  Schema,
  model,
  Document,
  Types,
  FilterQuery,
  UpdateQuery,
} from "mongoose";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

type UserDocument = Omit<User, "id"> & Document;
export interface UserSchema extends UserDocument {
  id: Types.ObjectId;
}
export type UserSearchSchema = FilterQuery<UserSchema>;
export type UserUpdateSchema = UpdateQuery<UserSchema>;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

const UserDB = model<UserSchema>("users", userSchema);
export default UserDB;
