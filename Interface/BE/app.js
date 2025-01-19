import express from "express";
import cors from "cors";
import connect from "./config/database.js";
import http from "http";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import webInitRouterPrediction from "./routes/predictionresult.route.js";

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

webInitRouterPrediction(app);

// Kết nối với database
(async () => {
  try {
    await connect(process.env.URI);
    server.listen(3000, () => {
      console.log("server is listening");
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
})();
