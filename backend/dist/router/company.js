"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyRouter = express_1.default.Router();
companyRouter.get("/login", (req, res) => {
    res.send("company login");
});
companyRouter.get("/register", (req, res) => {
    res.send("company register");
});
exports.default = companyRouter;
