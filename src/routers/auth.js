import express from "express";
import axios from "axios";
import authService from "../services/authservice";

const app = express.Router();

app.get("/register-google", async (req, res) => {
    console.log(req.query.code);
    res.send(authService.register(req.query.code, "google"));
});

export default app;