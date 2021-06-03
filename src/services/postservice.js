import userModel from "../models/usermodel.js";
import postModel from "../models/postmodel.js";
import counterModel from "../models/countermodel.js";
import { promises as fs } from "fs";

export default class PostService {
    create(data) {
        return new postModel(data);
    }

    async upload(author, postData, files) {
        ["participants", "price"].forEach(key => {
            postData[key] = parseInt(postData[key]);
        });
        const counter = await counterModel.findOneAndUpdate({ "$inc": { "postid": 1 } }).exec();
        let user = await userModel.findOne({ nickname: author }).exec();
        postData.postid = counter.postid;
        postData.images = files.map((x) => x.path.split('\\')[1]);
        // postData.longitude = user.longitude;
        // postData.latitude = user.latitude;
        postData.author = author;

        user.posts.push(postData.postid);

        const post = this.create(postData);
        await post.save();
        await user.save();
        return post;
    }

    async delete(postid, nickname) {
        const post = await postModel.findOne({ postid: postid }).exec();
        if (post.author !== nickname)
            throw new Error("unauthorized");
        const user = await userModel.findOne({ nickname: nickname }).exec();

        post.images.forEach(async (x) => { x || await fs.unlink(`${process.env.ROOT_DIR}/static/${x}`); });
        const postIdx = user.posts.findIndex(x => x == post.postid);
        user.posts.splice(postIdx, 1);

        await user.save();
        await post.deleteOne();
    }

    async getRecentPosts(num) {
        num = parseInt(num);
        const posts = await postModel.find({}).sort("updatedAt").limit(num).exec();
        return posts.slice(0, num);
    }

    async getPostsByCategory(category, num) {
        num = parseInt(num);
        const posts = await postModel.find({ category: category }).sort("updatedAt").limit(num).exec();
        return posts;
    }

    async searchPostsByWords(str, num) {
        num = parseInt(num);
        const posts = await postModel.find({
            $or: [
                {
                    title: {
                        $regex: str,
                        $options: "imxs"
                    }
                },
                {
                    content: {
                        $regex: str,
                        $options: "imxs"
                    }
                }
            ]
        }).sort("updatedAt").limit(num).exec();
        return posts;
    }

    async getPostsByAuthor(author, num) {
        num = parseInt(num);
        const posts = await postModel.find({ author: author })
            .sort("updatedAt").limit(num).exec();
        return posts;
    }
};