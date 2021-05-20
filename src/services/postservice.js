import userModel from "../models/usermodel.js";
import postModel from "../models/postmodel.js";
import counterModel from "../models/countermodel.js";
import { promises as fs } from "fs";

export default class PostService {
    create(data) {
        return new postModel(data);
    }

    async upload(author, postData, files) {
        Object.keys(postData).map((key) => {
            postData[key] = parseInt(postData[key]) || postData[key];
        });
        const counter = await counterModel.findOneAndUpdate({ "$inc": { "postid": 1 } }).exec();
        let user = await userModel.findOne({ name: author });
        postData.postid = counter.postid;
        postData.images = files.map((x) => x.path.split('\\')[1]);
        postData.location = user.location;
        postData.author = author;

        user.posts.push(postData.postid);
        user.participated.push(postData.postid);

        const post = this.create(postData);
        await post.save();
        await user.updateOne();
        return post;
    }

    async delete(postid, name) {
        const post = await postModel.findOne({ postid: postid });
        if (post.author !== name)
            throw new Error("unauthorized");

        post.images.forEach(async (x) => { x || await fs.unlink(`${process.env.ROOT_DIR}/static/${x}`); });
        await post.deleteOne();
    }

    async getRecentPosts(num) {
        const posts = await postModel.find({}).sort("postid");
        return posts.slice(0, num);
    }
};