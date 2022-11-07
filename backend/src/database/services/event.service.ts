import EventDB, {
  Event,
  EventSchema,
  EventUpdateSchema,
} from "../models/event.model";

export const getEvents = async (): Promise<EventSchema[] | null> => {
  const events = await EventDB.find({});
  if (!events) return null;
  return events;
};

export const getEvent = async (
  data: Pick<Event, "id">
): Promise<EventSchema | null> => {
  const event = await EventDB.findById(data.id);
  if (!event) return null;
  return event;
};

export const addEvent = async (
  data: Omit<Event, "id">
): Promise<EventSchema | null> => {
  const existingEvent = await EventDB.findOne({ title: data.title });
  if (existingEvent) return null;
  const newEvent = await EventDB.create(data);
  return newEvent;
};

export const updateEvent = async (
  userId: string,
  id: string,
  data: EventUpdateSchema
): Promise<EventSchema | null> => {
  const event = await EventDB.findById(id);
  if (!event || event.ownerId !== userId) return null;
  const modifiedEvent = await EventDB.findByIdAndUpdate(id, data);
  if (!modifiedEvent) return null;
  return modifiedEvent;
};

export const deleteEvent = async (
  userId: string,
  id: string
): Promise<boolean> => {
  const event = await EventDB.findById(id);
  if (!event || event.ownerId !== userId) return false;
  const deletedEvent = await EventDB.findByIdAndDelete(id);
  if (!deletedEvent) return false;
  return true;
};
