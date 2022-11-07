import {
  Schema,
  model,
  Document,
  Types,
  FilterQuery,
  UpdateQuery,
} from "mongoose";

export interface StakeHolder {
  name: string;
  image: string;
}
export interface Event {
  id: string;
  title: string;
  date: string;
  organizer: string;
  price: number;
  maxTicket: number;
  leftTicket: number;
  description: string;
  image: string;
  location: string;
  style: string;
  ownerId: string;
  stakeHolders: StakeHolder[];
}

type EventDocument = Omit<Event, "id"> & Document;
export interface EventSchema extends EventDocument {
  id: Types.ObjectId;
}
export type EventSearchSchema = FilterQuery<EventSchema>;
export type EventUpdateSchema = UpdateQuery<EventSchema>;

const eventSchema = new Schema({
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

const EventDB = model<EventSchema>("events", eventSchema);
export default EventDB;
