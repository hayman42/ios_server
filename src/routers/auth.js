import express from "express";
import authService from "../services/authservice";

const app = express.Router();

app.get("/register-google", async (req, res) => {
    try {
        const registerDto = req.query;
        var userInfo = await authService.register(registerDto.code, "google");
        if (userInfo === null)
            res.send("already exists")
        else
            res.send("ok");
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

export default app;