"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./user"));
const company_1 = __importDefault(require("./company"));
const event_1 = __importDefault(require("./event"));
const router = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use("/user", user_1.default);
    app.use("/company", company_1.default);
    app.use("/event", event_1.default);
};
exports.router = router;
