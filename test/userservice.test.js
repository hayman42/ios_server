import UserService from "../src/services/userservice";
import dbLoader from "../src/loaders/db";
import mongoose from "mongoose";
import userModel from "../src/models/usermodel";

const db = mongoose.connection;
describe("userservice test", () => {
    let userService;
    const email = "some@email.com";
    const name = "somename";
    const type = "kakao";

    beforeAll(done => {
        userService = new UserService;
        dbLoader();
        db.on("start", async () => {
            done();
        });
    });

    it("should be defined", () => {
        expect(userService).toBeDefined();
    });

    test("should save an user", async () => {
        const { email: testEmail, name: testName, authProvider: testType } = await userService.checkAndCreate(email, name, type);

        expect(email).toBe(testEmail);
        expect(name).toBe(testName);
        expect(type).toBe(testType);
    });

    test("should delete an user", async () => {
        await userService.checkAndCreate(email, name, type);
        await userService.quitUser(email, name);
    });

    test("should get userinfo", async () => {
        await userService.checkAndCreate(email, name, type);
        const user = await userService.getUserInfo(name);

        expect(user.email).toBe(email);
        expect(user.name).toBe(name);
        expect(user.authProvider).toBe(type);
    });

    afterAll(async () => {
        await userModel.deleteOne({ name: name });
        db.close();
    });;
});