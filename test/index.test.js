import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

const db = mongoose.connection;
describe("index test", () => {
    beforeAll(done => {
        db.on("start", () => done());
    });
    it("should be ok", () => {
        supertest(app).get("/").expect(200);
    });
    afterAll(() => {
        db.close();
        app.close();
    });
});