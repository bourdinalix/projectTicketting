import express from "express";
import {
  addEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../database/services/event.service";

import authRouter from "../middleware/auth";

const eventRouter = express.Router();

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

eventRouter.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    if (!events) return res.status(404).send({ message: "NO EVENTS" });

    if (req.query.style && req.query.location) {
      const styledEvents = events.filter((event) => {
        if (event.style === req.query.style) return true;
        return false;
      });
      if (styledEvents.length === 0)
        return res.status(404).send({
          message: `No ${req.query.style} events found in ${req.query.location}`,
        });
      const styledAndLocatedEvents = styledEvents.filter((styledEvent) => {
        if (styledEvent.location === req.query.location) return true;
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
        if (event.style === req.query.style) return true;
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
        if (event.location === req.query.location) return true;
        return false;
      });
      if (locatedEvents.length === 0)
        return res
          .status(404)
          .send({ message: `No events found in ${req.query.location}` });
      return res.status(200).json(locatedEvents);
    }

    res.status(200).send(events);
  } catch (e) {
    console.log("failed to get events", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

eventRouter.get("/:id", async (req, res) => {
  try {
    const event = await getEvent({
      id: req.params.id,
    });
    if (!event) return res.status(404).send({ message: "EVENT NOT FOUND" });
    return res.status(200).json(event.toObject({ getters: true }));
  } catch (e) {
    console.log("failed to get event", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

eventRouter.post("/", authRouter, async (req, res) => {
  try {
    const event = await addEvent({
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
    if (!event) return res.status(400).send({ message: "ALREADY EXISTS" });
    res.status(200).json(event.toObject({ getters: true }));
  } catch (e) {
    console.log("failed to add event", e);
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

eventRouter.put("/:id", authRouter, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.body.auth.userId;
    const modifiedEvent = await updateEvent(userId, eventId, req.body.content);
    const event = await getEvent({ id: eventId });
    if (!modifiedEvent || !event)
      return res.status(400).send({ message: "BAD REQUEST" });
    res.status(200).json(modifiedEvent.toObject({ getters: true }));
  } catch (e) {
    console.log("failed to update event");
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

eventRouter.delete("/:id", authRouter, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.auth.userId;
    const deletedEvent = await deleteEvent(userId, id);
    if (!deletedEvent) return res.status(400).send({ message: "BAD REQUEST" });
    res.status(200).send({ message: "EVENT DELETED" });
  } catch (e) {
    console.log("failed to delete event");
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

export default eventRouter;
