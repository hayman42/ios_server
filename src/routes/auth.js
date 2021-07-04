import express from "express";
import AuthService from "../services/authservice";
import UserService from "../services/userservice";
const app = express.Router();
const authService = new AuthService;
const userService = new UserService;

app.get("/register/:type", async (req, res) => {
    const access_token = await authService.getToken(req.query.code, req.params.type);
    res.send(`code: ${req.query.code}\naccess_token: ${access_token}`);
});

/**
 * @swagger
 *  /auth/signin/{type}:
 *    get:
 *      summary: 로그인 api
 *      tags: [Auth]
 *      description: OAuth 결과에 따라 신규 유저의 경우 db에 정보를 저장합니다. 이 후 인증 토큰을 발급합니다.
 *      parameters:
 *        - in: path
 *          name: type
 *          required: true
 *          description: OAuth 로그인 타입 - google or kakao or apple
 *          schema:
 *            type: string
 *            example: google
 *        - in: query
 *          name: access_token
 *          required: true
 *          description: 로그인 서버에서 받은 엑세스 토큰
 *          schema:
 *            type: string
 *            example: token_string
 *        - in: query
 *          name: name
 *          required: true
 *          description: 유저 이름
 *          schema:
 *            type: string
 *            example: 한재연
 *        - in: query
 *          name: device_token
 *          required: true
 *          description: 디바이스 토큰
 *          schema:
 *            type: string
 *            example: device_token_string
 *      responses:
 *       200:
 *        description: 로그인 성공
 */
app.get("/signin/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const { access_token, name, device_token = "" } = req.query;

        const { email } = await authService.getInfo(access_token, type);
        const { isNew, user } = await userService.checkAndCreate(email, name, type, device_token);
        const token = authService.generateToken(email);
        res.status(200)
            .cookie("token", token)
            .cookie("email", email)
            .json({
                isNew,
                user
            });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: e.message
        });
    }
});

export default app;