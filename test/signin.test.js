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

    test("should sign in and verify token", async () => {
        const query = qs.stringify({
            code: "4/0AY0e-g76o5DNTKK3YD1rtH7V0pOidAtu1jGdTWRTDLJlzi0LVz2bQsLjCwRWQb5F5R1AWA",
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