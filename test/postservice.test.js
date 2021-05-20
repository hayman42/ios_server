import dbLoader from "../src/loaders/db";
import mongoose from "mongoose";
import PostService from "../src/services/postservice";
import postModel from "../src/models/postmodel";

const db = mongoose.connection;
describe("test postservice", () => {
    const name = "test";
    let postService;
    beforeAll(done => {
        dbLoader();
        postService = new PostService;
        db.on("start", () => done());
    });

    it("should be defined", () => {
        expect(postService).toBeDefined();
    });

    test("should delete a post", async () => {
        const postid = 1;
        await postService.delete(postid, name);
        expect(await postModel.findOne({ postid: postid })).toBe(null);

    });

    test("should return recent posts", async () => {
        const posts = await postService.getRecentPosts(10);
        expect(posts.length <= 10).toBe(true);
        console.log(posts);
    });

    afterAll(async () => {
        db.close();
    });
});