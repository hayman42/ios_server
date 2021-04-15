import express from "express";
import authService from "../services/authservice";

const app = express.Router();

app.get("/register/:type", async (req, res) => {
    try {
        const { code } = req.query;
        const type = req.params.type;
        var { status, data } = await authService.register(code, type);
        res.status(status).json(data);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

export default app;