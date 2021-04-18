import express from "express";
import authService from "../services/authservice";

const app = express.Router();

app.get("/signin", async (req, res) => {
    try {
        const { status, data } = await authService.signin(req.query);
        res.status(status).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            data: { msg: "internal server error" }
        });
    }
});

app.get("/quit", async (req, res) => {
    try {
        const { status, data } = await authService.quit(req.query.token);
        res.status(status).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            data: { msg: "internal server error" }
        });
    }
});

export default app;