// Import models
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

import { RcvData } from "../models/rcvdata.model.js";

let pythonProcess = null;

function webInitRouterPrediction(app) {
  app.get("/api/rcvdata", async (req, res) => {
    try {
      const data = await RcvData.find();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching rcvdata:", error);
      res.status(500).json({ message: "Failed to fetch data", error });
    }
  });

  app.post("/api/start-collecting", (req, res) => {
    const { videoId } = req.body;
  
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }
  
    if (pythonProcess) {
      pythonProcess.kill();
      pythonProcess = null;
    }

    const scriptPath = path.resolve("./python/crawlData.py");
    pythonProcess = spawn("python", [scriptPath, videoId]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python output: ${data}`);
    });
  
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });
  
    pythonProcess.on("close", (code) => {
      console.log(`Python script stopped with code ${code}`);
      pythonProcess = null;
    });
  
    res.status(200).json({ message: "Python script started successfully" });
  });
  
  app.delete("/api/stop-collecting", async (req, res) => {
    try {
      if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
        console.log("Python script stopped");
      }
  
      await RcvData.deleteMany();
      res.status(200).json({ message: "Data deleted and script stopped" });
    } catch (error) {
      console.error("Error stopping script or deleting data:", error);
      res.status(500).json({ message: "Failed to stop script or delete data", error });
    }
  });
}

export default webInitRouterPrediction;
