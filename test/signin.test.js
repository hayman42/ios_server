import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import userModel from "../src/models/usermodel";
import qs from "querystring";
import AuthService from "../src/services/authservice";

const db = mongoose.connection;
describe("signin test", () => {
    let authService;
    const type = "google";
    const userName = "jaeyeon";
    beforeAll(done => {
        authService = new AuthService;
        db.on("start", () => done());
    });

    test("should sign in", async () => {
        const query = qs.stringify({
            access_token: "ya29.a0AfH6SMAbm2wOWlzQp6w0TKedtsjfBTikTpQ70pH462TNc4bFmiptxrzamdTQ_gg5G1qr5O8l9n-cZktTciPHSF3TfcRAj5q9yVifxZ2BZyWXuaftV1KkyqKQadWxE6__brexO_IqfE8qXqJarEgwqOLPqLVV",
            name: userName
        });
        const res = await supertest(app).get(`/api/v0/auth/signin/${type}?` + query);
        expect(res.statusCode).toBe(200);
        expect(await userModel.findOne({ name: userName })).toBeDefined();
        console.log(res.headers);
    });

    afterAll(async () => {
        await userModel.deleteOne({ name: userName });
        db.close();
        app.close();
    });
});