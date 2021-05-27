import express from "express";
import AuthService from "../services/authservice.js";
import UserService from "../services/userservice.js";

const app = express.Router();
const authService = new AuthService;
const userService = new UserService;

/**
 * @swagger
 *  /user/quit:
 *    get:
 *      summary: 탈퇴 api
 *      tags: [User]
 *      description: 해당 유저의 정보를 db에서 삭제합니다.
 *      responses:
 *       200:
 *        description: 탈퇴 성공
 */
app.get("/quit", authService.verifyToken, async (req, res) => {
    try {
        const { email, name } = req.cookies;

        await userService.quitUser(email, name);
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

/**
 * @swagger
 *  /user/info:
 *    get:
 *      summary: 유저 정보를 가져오는 api
 *      tags: [User]
 *      description: 로그인 되어있는 유저의 정보를 가져옵니다.
 *      responses:
 *       200:
 *        description: 성공
 */
app.get("/info", authService.verifyToken, async (req, res) => {
    try {
        let { name } = req.cookies;
        const user = await userService.getUserInfo(name);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ user: user });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});

export default app;