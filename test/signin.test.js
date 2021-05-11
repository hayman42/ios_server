import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
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
            code: "4/0AY0e-g4206Sgcc3Hdt_yCBDrKFhQxJw0c9g7tRxZQ7wtQWUyXVG1_qLRlzgl2skm9N8tzQ",
            name: userName
        });
        const res = await supertest(app).get(`/api/v0/auth/signin/${type}?` + query);
        expect(res.statusCode).toBe(200);

        const { token, email, name } = res.body;
        authService.verifyToken(token, email, name);
        expect(name).toBe(userName);
    });

    afterAll(() => {
        db.close();
        app.close();
    });
});