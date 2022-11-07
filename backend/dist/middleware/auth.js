"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
authRouter.use((req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(400).send({ message: "TOKEN NOT GOOD" });
        const decodedToken = jsonwebtoken_1.default.verify(token, "RANDOM_TOKEN_SECRET");
        if (!decodedToken)
            return res.status(400).send({ message: "TOKEN NOT GOOD" });
        const userId = decodedToken.userId;
        req.body.auth = {
            userId: userId,
        };
        next();
    }
    catch (e) {
        res.status(401).send({ message: "INTERNAL SERVER ERROR" });
    }
});
exports.default = authRouter;
