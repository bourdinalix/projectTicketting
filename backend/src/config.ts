import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

export default {
  port: env.get("PORT").default("4000").asPortNumber(),
  mongoPath: env
    .get("MONGO_PATH")
    .default(
      "mongodb+srv://tickettac:tickettac@cluster0.p4algrl.mongodb.net/?retryWrites=true&w=majority"
    )
    .asString(),
  randomTokenSecret: env
    .get("RANDOM_TOKEN_SECRET")
    .default("randomValue")
    .asString(),
};
