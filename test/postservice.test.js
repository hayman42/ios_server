import dbLoader from "../src/loaders/db";
import mongoose from "mongoose";
import PostService from "../src/services/postservice";
import postModel from "../src/models/postmodel";
import userModel from "../src/models/usermodel";
import { v4 } from "uuid";

function createPostData() {
    return {
        title: v4(),
        content: v4(),
        link: v4(),
        needPeople: 3,
        price: 4,
        category: v4()
    };
}

const db = mongoose.connection;
describe("test postservice", () => {
    const nickname = "test";
    let postService;
    beforeAll(done => {
        dbLoader();
        postService = new PostService;
        db.on("start", () => done());
    });

    it("should be defined", () => {
        expect(postService).toBeDefined();
    });

    test("should upload a post without images", async () => {
        const reqData = createPostData();
        const postData = {};
        const keys = Object.keys(reqData);
        keys.forEach(key => postData[key] = reqData[key]);
        const post = await postService.upload(nickname, postData, []);

        keys.forEach(key => expect(post[key]).toBe(reqData[key]));
    });

    test("should delete a post", async () => {
        const postData = createPostData();
        await postService.upload(nickname, postData, []);

        const user = await userModel.findOne({ nickname: nickname }).exec();
        const postid = user.posts[user.posts.length - 1];
        await postService.delete(postid, nickname);
        const newUser = await userModel.findOne({ nickname: nickname }).exec();

        expect(await postModel.findOne({ postid: postid }).exec()).toBe(null);
        expect(user.posts.length).toBe(newUser.posts.length + 1);

    });

    test("should return recent posts", async () => {
        await Promise.all(
            [...Array(10)].map(async () => {
                const postData = createPostData();
                await postService.upload(nickname, postData, []);
            })
        );
        const posts = await postService.getRecentPosts(10);

        expect(posts.length).toBe(10);
        for (const i of posts.keys()) {
            if (i == posts.length - 1) break;
            expect(posts[i].updatedAt < posts[i + 1].updatedAt).toBe(true);
        }
    });

    test("should search posts by category", async () => {
        const category = "test";
        await Promise.all(
            [...Array(6)].map(async () => {
                let postData = createPostData();
                await postService.upload(nickname, postData, []);
            })
        );
        await Promise.all(
            [...Array(4)].map(async () => {
                let postData = createPostData();
                postData.category = category;
                await postService.upload(nickname, postData, []);
            })
        );
        const posts = await postService.getPostsByCategory(category, 10);

        expect(posts.length).toBe(4);
        posts.forEach(post => expect(post.category).toBe(category));
    });

    test("should search posts containing a word", async () => {
        const word = "test";
        await Promise.all(
            [...Array(6)].map(async () => {
                let postData = createPostData();
                postData.title = postData.title + word;
                await postService.upload(nickname, postData, []);
            })
        );
        await Promise.all(
            [...Array(4)].map(async () => {
                let postData = createPostData();
                postData.content = postData.content + word;
                await postService.upload(nickname, postData, []);
            })
        );
        const posts = await postService.searchPostsByWords(word, 10);

        expect(posts.length).toBe(10);
        posts.forEach(post => expect(post.title.includes(word) || post.content.includes(word)).toBe(true));
    });

    test("should search posts by author", async () => {
        await Promise.all(
            [...Array(10)].map(async () => {
                let postData = createPostData();
                await postService.upload(nickname, postData, []);
            })
        );
        const posts = await postService.getPostsByAuthor(nickname, 10);
        expect(posts.length).toBe(10);
        posts.forEach(post => expect(post.author).toBe(nickname));
    });

    afterEach(async () => {
        await postModel.deleteMany({ author: nickname }).exec();
        const user = await userModel.findOne({ nickname: nickname }).exec();
        user.posts = [];
        await user.save();
    });

    afterAll(async () => {
        db.close();
    });
});