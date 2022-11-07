"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: String,
    date: String,
    organizer: String,
    price: Number,
    maxTicket: Number,
    leftTicket: Number,
    description: String,
    image: String,
    location: String,
    style: String,
    ownerId: String,
    stakeHolders: [{ name: String, image: String }],
});
const EventDB = (0, mongoose_1.model)("events", eventSchema);
exports.default = EventDB;
