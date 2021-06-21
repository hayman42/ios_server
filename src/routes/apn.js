import express from "express";
import ApnService from "../services/apnservice";
import authenticate from "../middlewares/authenticate";

const app = express.Router();
const apnService = new ApnService;

/**
 * @swagger
 *  /apn/push:
 *    post:
 *      summary: 푸쉬 알림 보내기
 *      tags: [APN]
 *      description: 해당 유저에게 푸쉬 알림을 보냅니다.
 *      requestBody:
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              required:
 *                - message
 *                - nickname
 *              properties:
 *                message:
 *                  type: string
 *                  description: 보낼 메시지
 *                nickname:
 *                  type: string
 *                  description: 푸쉬 알림 보낼 유저의 닉네임
 *      responses:
 *       200:
 *        description: 푸쉬 알림 요청 성공
 */
app.post("/push", authenticate, async (req, res) => {
    try {
        const { message, nickname } = req.body;
        const result = await apnService.sendPush(message, nickname);
        res.status(200)
            .cookie("token", req.newToken)
            .json({ result });
    } catch (e) {
        console.log(e.message);
        res.send({
            msg: e.message
        });
    }
});

export default app;