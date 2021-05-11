import express from "express";
import AuthService from "../services/authservice";
import UserService from "../services/userservice";

const app = express.Router();
const authService = new AuthService;
const userService = new UserService;

app.get("/register/:type", async (req, res) => {
    res.send(req.query.code);
});

app.get("/signin/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const { code, name } = req.query;

        const accessToken = await authService.getToken(code, type);
        const { email } = await authService.getInfo(accessToken, type);
        await userService.checkAndCreate(email, name, type);
        const token = authService.generateToken(email, name);
        res.status(200).json({
            token: token,
            email: email,
            name: name
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});

app.get("/quit", async (req, res) => {
    try {
        const { token, email, name } = req.query;

        authService.verifyToken(token, email, name);
        const user = await userService.find(email, name);
        await userService.delete(user);
        res.status(200).json({
            msg: "delete"
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});

export default app;