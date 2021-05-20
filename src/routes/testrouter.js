import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express.Router();

app.get("/", async (req, res) => {
    res.sendFile(process.env.ROOT_DIR + "\\src\\resources\\test.html");
});

export default app;