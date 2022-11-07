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
exports.deleteEvent = exports.updateEvent = exports.addEvent = exports.getEvent = exports.getEvents = void 0;
const event_model_1 = __importDefault(require("../models/event.model"));
const getEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find({});
    if (!events)
        return null;
    return events;
});
exports.getEvents = getEvents;
const getEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findById(data.id);
    if (!event)
        return null;
    return event;
});
exports.getEvent = getEvent;
const addEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEvent = yield event_model_1.default.findOne({ title: data.title });
    if (existingEvent)
        return null;
    const newEvent = yield event_model_1.default.create(data);
    return newEvent;
});
exports.addEvent = addEvent;
const updateEvent = (userId, id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findById(id);
    if (!event || event.ownerId !== userId)
        return null;
    const modifiedEvent = yield event_model_1.default.findByIdAndUpdate(id, data);
    if (!modifiedEvent)
        return null;
    return modifiedEvent;
});
exports.updateEvent = updateEvent;
const deleteEvent = (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findById(id);
    if (!event || event.ownerId !== userId)
        return false;
    const deletedEvent = yield event_model_1.default.findByIdAndDelete(id);
    if (!deletedEvent)
        return false;
    return true;
});
exports.deleteEvent = deleteEvent;
