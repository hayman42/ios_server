import UserService from "../src/services/userservice";
import dbLoader from "../src/loaders/db";
import mongoose from "mongoose";
import userModel from "../src/models/usermodel";

const db = mongoose.connection;
describe("authservice test", () => {
    let userService;
    beforeAll(done => {
        userService = new UserService;
        dbLoader();
        db.on("start", async () => {
            await userModel.deleteMany({});
            done();
        });
    });

    it("should be defined", () => {
        expect(userService).toBeDefined();
    });

    test("should save an user", async () => {
        const email = "some@email.com";
        const name = "somename";
        const type = "kakao";
        const { email: testEmail, name: testName, authProvider: testType } = await userService.checkAndCreate(email, name, type);
        expect(email).toBe(testEmail);
        expect(name).toBe(testName);
        expect(type).toBe(testType);

    });

    afterAll(async () => {
        await userModel.deleteMany({});
        db.close();
    });;
});