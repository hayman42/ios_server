import express from "express";
import UserService from "../services/userservice";
import authenticate from "../middlewares/authenticate";
import upload from "../middlewares/upload";

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
 *    post:
 *      summary: 유저 정보 수정 api
 *      tags: [User]
 *      description: 로그인 되어있는 유저의 정보를 수정합니다. 수정 할 수 있는 정보는 nickname, location, 프로필 이미지 입니다.
 *                   모든 파라미터를 전달할 필요는 없습니다. 수정할 데이터만 전달해 주세요.
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                nickname:
 *                  type: string
 *                  description: 변경할 닉네임
 *                longitude:
 *                  type: number
 *                  description: 변경할 위치정보
 *                latitude:
 *                  type: number
 *                  description: 변경할 위치정보
 *                images:
 *                  type: file
 *                  description: 변경할 프로필 이미지
 *                delete_img:
 *                  type: string
 *                  description: 프로필 이미지 삭제를 원할경우 true. 이 값이 true 일 경우 이미지는 없어야 합니다.
 *      responses:
 *       200:
 *        description: 성공
 */
app.post("/update", upload, authenticate, async (req, res) => {
    try {
        let { email } = req.cookies;
        let { nickname = null, longitude = null, latitude = null, delete_img = null } = req.body;
        const user = await userService.updateUserInfo(email, nickname, longitude, latitude, delete_img, req.files);
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
 *  /user/follow:
 *    get:
 *      summary: 팔로우 api
 *      tags: [User]
 *      description: 유저를 팔로우 합니다.
 *      parameters:
 *        - in: query
 *          name: nickname
 *          required: true
 *          description: 팔로우할 유저의 닉네임
 *          schema:
 *            type: string
 *      responses:
 *       200:
 *        description: 성공
 */
app.get("/follow", authenticate, async (req, res) => {
    try {
        let { email } = req.cookies;
        let { nickname } = req.params;
        await userService.followUser(email, nickname);
        res.status(200)
            .cookie("token", req.newToken)
            .json({
                msg: "success"
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
 *  /user/unfollow:
 *    get:
 *      summary: 언팔로우 api
 *      tags: [User]
 *      description: 유저를 언팔로우 합니다.
 *      parameters:
 *        - in: query
 *          name: nickname
 *          required: true
 *          description: 언팔로우할 유저의 닉네임
 *          schema:
 *            type: string
 *      responses:
 *       200:
 *        description: 성공
 */
app.get("/unfollow", authenticate, async (req, res) => {
    try {
        let { email } = req.cookies;
        let { nickname } = req.params;
        await userService.unfollowUser(email, nickname);
        res.status(200)
            .cookie("token", req.newToken)
            .json({
                msg: "success"
            });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            msg: e.message
        });
    }
});

export default app;