import express from "express";
import dotenv from "dotenv";
import UserService from "../services/userservice";

dotenv.config();
const app = express.Router();
const userService = new UserService;

app.get("/", async (req, res) => {
    res.sendFile(process.env.ROOT_DIR + "/src/resources/test.html");
});

app.get("/create", async (req, res) => {
    const { email, name, type, dtoken } = req.query;
    const user = await userService.checkAndCreate(email, name, type, dtoken);
    res.json({ user });
});

app.get("/", async (req, res) => {
    console.log(req.query);
});

export default app;