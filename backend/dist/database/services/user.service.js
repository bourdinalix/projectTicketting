"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.addUser = exports.getUser = exports.getUserByEmail = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({});
    if (!users)
        return null;
    return users;
});
exports.getUsers = getUsers;
const getUserByEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: data.email });
    if (!user)
        return null;
    return user;
});
exports.getUserByEmail = getUserByEmail;
const getUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(data.id);
    if (!user)
        return null;
    return user;
});
exports.getUser = getUser;
const addUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({ email: data.email });
    if (existingUser) {
        return null;
    }
    const newUser = yield user_model_1.default.create(data);
    return newUser;
});
exports.addUser = addUser;
const userLogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({ email: data.email });
    if (!existingUser)
        return null;
    const isValid = bcrypt_1.default.compare(data.password, existingUser.password);
    if (!isValid)
        return null;
    const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "6h",
    });
    return token;
});
exports.userLogin = userLogin;
