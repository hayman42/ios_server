import dbLoader from "../src/loaders/db";
import mongoose from "mongoose";
import ChatService from "../src/services/chatservice";
import userModel from "../src/models/usermodel";
import { expect, test } from "@jest/globals";

const db = mongoose.connection;

describe("chatservice test", () => {
    let chatService;
    const email = "test2";
    const postid = 123;
    beforeAll(done => {
        dbLoader();
        chatService = new ChatService;
        db.on("start", () => done());
    });

    it("should be defined", () => {
        expect(chatService).toBeDefined();
    });

    test("should join a chatroom", async () => {
        await chatService.joinChatroom(postid, email);
        const user = await userModel.findOne({ email: email });
        expect(user.chatroomList.includes(postid)).toBe(true);

    });

    test("should get a member list", async () => {
        await chatService.joinChatroom(postid, email);
        const users = await chatService.getMemberList(postid);
        users.forEach(user => expect(user.chatroomList.includes(postid)).toBe(true));
    });

    test("shoulde quit the chat room", async () => {
        await chatService.joinChatroom(postid, email);
        await chatService.quitChatroom(postid, email);
        const user = await userModel.findOne({ email: email });
        expect(user.chatroomList.includes(postid)).toBe(false);
    });

    afterEach(async () => {
        const user = await userModel.findOne({ email: email });
        user.chatroomList = [];
        await user.save();
    });

    afterAll(async () => {
        db.close();
    });
});