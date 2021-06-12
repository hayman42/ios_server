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
    const dtoken = "device1";

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
        const { user } = await userService.checkAndCreate(email, name, type, dtoken);
        const { email: testEmail, name: testName, authProvider: testType, deviceToken } = user;

        expect(email).toBe(testEmail);
        expect(name).toBe(testName);
        expect(type).toBe(testType);
        expect(deviceToken).toBe(dtoken);
    });

    test("should delete an user", async () => {
        await userService.checkAndCreate(email, name, type);
        await userService.quitUser(email);
    });

    test("should get userinfo", async () => {
        await userService.checkAndCreate(email, name, type);
        const user = await userService.getUserInfo(email);

        expect(user.email).toBe(email);
        expect(user.name).toBe(name);
        expect(user.authProvider).toBe(type);
    });

    test("should update location info", async () => {
        let updateInfo = {
            longitude: "3.312",
            latitude: "3.11"
        };
        const user = await userService.updateUserInfo("test", updateInfo);

        expect(user.longitude).toBe(parseFloat(updateInfo.longitude));
        expect(user.latitude).toBe(parseFloat(updateInfo.latitude));
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: email });
        db.close();
    });;
});