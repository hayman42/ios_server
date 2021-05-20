import express from "express";
import AuthService from "../services/authservice.js";
import UserService from "../services/userservice.js";

const app = express.Router();
const authService = new AuthService;
const userService = new UserService;

app.get("/register/:type", async (req, res) => {
    res.send(req.query.code);
});

/**
 * @swagger
 *  /auth/signin/{type}:
 *    get:
 *      summary: 로그인 api
 *      tags: [Auth]
 *      description: OAuth 결과에 따라 신규 유저의 경우 db에 정보를 저장한 후 토큰을 발급합니다.
 *      parameters:
 *        - in: path
 *          name: type
 *          required: true
 *          description: OAuth 로그인 타입 - google or kakao or apple
 *          schema:
 *            type: string
 *            example: google
 *        - in: query
 *          name: code
 *          required: true
 *          description: OAuth code
 *          schema:
 *            type: string
 *            example: code_string
 *        - in: query
 *          name: name
 *          required: true
 *          description: 유저 이름
 *          schema:
 *            type: string
 *            example: 한재연
 *      responses:
 *       200:
 *        description: 로그인 성공
 */
app.get("/signin/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const { code, name } = req.query;

        const accessToken = await authService.getToken(code, type);
        const { email } = await authService.getInfo(accessToken, type);
        await userService.checkAndCreate(email, name, type);
        const token = authService.generateToken(email, name);
        res.status(200)
            .cookie("token", token)
            .cookie("email", email)
            .cookie("name", name)
            .send();
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});

/**
 * @swagger
 *  /auth/quit:
 *    get:
 *      summary: 탈퇴 api
 *      tags: [Auth]
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

export default app;