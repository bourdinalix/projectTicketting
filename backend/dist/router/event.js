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
const event_service_1 = require("../database/services/event.service");
const auth_1 = __importDefault(require("../middleware/auth"));
const eventRouter = express_1.default.Router();
eventRouter.get("/locations", (req, res) => {
    return res.status(200).send({
        locations: ["paris", "marseille", "toulouse", "bordeaux"],
    });
});
eventRouter.get("/styles", (req, res) => {
    return res
        .status(200)
        .send({ styles: ["musique", "sport", "caritatif", "autres"] });
});
eventRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield (0, event_service_1.getEvents)();
        if (!events)
            return res.status(404).send({ message: "NO EVENTS" });
        if (req.query.style && req.query.location) {
            const styledEvents = events.filter((event) => {
                if (event.style === req.query.style)
                    return true;
                return false;
            });
            if (styledEvents.length === 0)
                return res.status(404).send({
                    message: `No ${req.query.style} events found in ${req.query.location}`,
                });
            const styledAndLocatedEvents = styledEvents.filter((styledEvent) => {
                if (styledEvent.location === req.query.location)
                    return true;
                return false;
            });
            if (styledAndLocatedEvents.length === 0)
                return res.status(404).send({
                    message: `No ${req.query.style} events found in ${req.query.location}`,
                });
            return res.status(200).json(styledAndLocatedEvents);
        }
        if (req.query.style) {
            const styledEvents = events.filter((event) => {
                if (event.style === req.query.style)
                    return true;
                return false;
            });
            if (styledEvents.length === 0)
                return res
                    .status(404)
                    .send({ message: `No ${req.query.style} events found` });
            return res.status(200).json(styledEvents);
        }
        if (req.query.location) {
            const locatedEvents = events.filter((event) => {
                if (event.location === req.query.location)
                    return true;
                return false;
            });
            if (locatedEvents.length === 0)
                return res
                    .status(404)
                    .send({ message: `No events found in ${req.query.location}` });
            return res.status(200).json(locatedEvents);
        }
        res.status(200).send(events);
    }
    catch (e) {
        console.log("failed to get events", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
eventRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield (0, event_service_1.getEvent)({
            id: req.params.id,
        });
        if (!event)
            return res.status(404).send({ message: "EVENT NOT FOUND" });
        return res.status(200).json(event.toObject({ getters: true }));
    }
    catch (e) {
        console.log("failed to get event", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
eventRouter.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield (0, event_service_1.addEvent)({
            title: req.body.content.title,
            date: req.body.content.date,
            organizer: req.body.content.organizer,
            price: req.body.content.price,
            maxTicket: req.body.content.maxTicket,
            leftTicket: req.body.content.leftTicket,
            description: req.body.content.description,
            image: req.body.content.image,
            location: req.body.content.location,
            style: req.body.content.style,
            ownerId: req.body.auth.userId,
            stakeHolders: req.body.content.stakeHolders,
        });
        if (!event)
            return res.status(400).send({ message: "ALREADY EXISTS" });
        res.status(200).json(event.toObject({ getters: true }));
    }
    catch (e) {
        console.log("failed to add event", e);
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
eventRouter.put("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id;
        const userId = req.body.auth.userId;
        const modifiedEvent = yield (0, event_service_1.updateEvent)(userId, eventId, req.body.content);
        const event = yield (0, event_service_1.getEvent)({ id: eventId });
        if (!modifiedEvent || !event)
            return res.status(400).send({ message: "BAD REQUEST" });
        res.status(200).json(modifiedEvent.toObject({ getters: true }));
    }
    catch (e) {
        console.log("failed to update event");
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
eventRouter.delete("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.body.auth.userId;
        const deletedEvent = yield (0, event_service_1.deleteEvent)(userId, id);
        if (!deletedEvent)
            return res.status(400).send({ message: "BAD REQUEST" });
        res.status(200).send({ message: "EVENT DELETED" });
    }
    catch (e) {
        console.log("failed to delete event");
        res.status(500).send({ message: "INTERNAL SERVER ERROR" });
    }
}));
exports.default = eventRouter;
