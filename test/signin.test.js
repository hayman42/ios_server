import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import userModel from "../src/models/usermodel";
import qs from "querystring";
import AuthService from "../src/services/authservice";

const db = mongoose.connection;
describe("signin test", () => {
    let authService;
    beforeAll(done => {
        authService = new AuthService;
        db.on("start", () => done());
    });

    test("should sign in and verify token", async () => {
        const type = "google";
        const userName = "jaeyeon";
        const query = qs.stringify({
            code: "4/0AY0e-g55Seie0i9rQW0nFskip8dgbrOwo_V9Ijc7epgjnjpCjG9r7nE2z_62iaKhFDlcDQ",
            name: userName
        });
        const res = await supertest(app).get(`/api/v0/auth/signin/${type}?` + query);
        expect(res.statusCode).toBe(200);

        const { token, email, name } = res.body;
        authService.verifyToken(token, email, name);
        expect(name).toBe(userName);
    });

    afterAll(async () => {
        await userModel.deleteMany({});
        db.close();
        app.close();
    });
});