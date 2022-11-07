import express from "express";
import { createServer } from "http";
import config from "./config";
import { setConnection } from "./database";
import { router } from "./router";

setConnection();
const app = express();
const httpServer = createServer(app);
router(app);
httpServer.listen(config.port, () => {
  return console.log(`server is listening on ${config.port}`);
});
