import express from "express";
import UserService from "../services/userservice";
import authenticate from "../middlewares/authenticate";

const app = express.Router();
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
app.get("/quit", authenticate, async (req, res) => {
    try {
        const { email } = req.cookies;

        await userService.quitUser(email);
        res.status(200).json({
            msg: "delete"
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: e.message
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
app.get("/info", authenticate, async (req, res) => {
    try {
        let { email } = req.cookies;
        const user = await userService.getUserInfo(email);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ user });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: e.message
        });
    }
});

/**
 * @swagger
 *  /user/update:
 *    get:
 *      summary: 유저 정보 수정 api
 *      tags: [User]
 *      description: 로그인 되어있는 유저의 정보를 수정합니다. 수정 할 수 있는 정보는 nickname, location 입니다.
 *      parameters:
 *        - in: query
 *          name: nickname
 *          description: 변경 할 닉네임
 *          schema:
 *            type: string
 *            example: hayman321
 *        - in: query
 *          name: longitude
 *          description: 변경할 위치정보
 *          schema:
 *            type: number
 *        - in: query
 *          name: latitude
 *          description: 변경할 위치정보
 *          schema:
 *            type: number
 *      responses:
 *       200:
 *        description: 성공
 */
app.get("/update", authenticate, async (req, res) => {
    try {
        let { email } = req.cookies;
        let updateInfo = req.query;
        const user = await userService.updateUserInfo(email, updateInfo);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ user });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: e.message
        });
    }
});

export default app;