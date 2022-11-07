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
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../database/services/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = express_1.default.Router();
userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUser)({
            id: req.params.id,
        });
        if (!user)
            return res.status(404).send({ message: "USER NOT FOUND" });
    }
    catch (e) {
        console.log("failed to get user", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield (0, user_service_1.addUser)({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        });
        if (!user)
            return res.status(400).send({ message: "ALREADY EXISTS" });
        res.status(200).json(user.toObject({ getters: true }));
    }
    catch (e) {
        console.log("failed to add user", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginToken = yield (0, user_service_1.userLogin)({
            email: req.body.email,
            password: req.body.password,
        });
        if (!loginToken)
            return res.status(400).send({ message: "WRONG CREDENTIALS" });
        return res.status(200).json(loginToken);
    }
    catch (e) {
        console.log("failed to add user", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
exports.default = userRouter;
