import supertest from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import userModel from "../src/models/usermodel";

const db = mongoose.connection;
describe("test /signin", () => {
    const email = "some@email.com";
    const name = "name";
    const location = "korea";
    beforeAll(done => {
        db.on("start", () => done());
    });
    it("should be ok", async () => {
        const res = await supertest(app).get("/api/v0/auth/signin").query({
            email: email,
            name: name,
            location: location
        });
        console.log(res.body);
        expect(res.status).toBe(200);
    });
    afterAll(async () => {
        await userModel.deleteOne({ email: email, name: name });
        db.close();
        app.close();
    });
});