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
    const femail = "friend@email.com";
    const fnickname = "friend";

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

    test("should follow and unfollow", async () => {
        await userService.checkAndCreate(email, name, type);
        await userService.checkAndCreate(femail, fnickname, type);
        await userService.updateUserInfo(email, name, null, null, null, []);
        await userService.updateUserInfo(femail, fnickname, null, null, null, []);


        await userService.followUser(email, fnickname);

        let user = await userModel.findOne({ nickname: name });
        let friend = await userModel.findOne({ nickname: fnickname });

        expect(user.following.includes(fnickname)).toBe(true);
        expect(friend.followers.includes(name)).toBe(true);

        await userService.unfollowUser(email, fnickname);

        user = await userModel.findOne({ nickname: name });
        friend = await userModel.findOne({ nickname: fnickname });

        expect(user.following.includes(fnickname)).toBe(false);
        expect(friend.followers.includes(name)).toBe(false);
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: email });
        await userModel.deleteOne({ email: femail });
        db.close();
    });;
});