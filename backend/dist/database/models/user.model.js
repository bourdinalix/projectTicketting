"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
});
const UserDB = (0, mongoose_1.model)("users", userSchema);
exports.default = UserDB;
