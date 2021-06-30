import userModel from "../models/usermodel.js";
import postModel from "../models/postmodel.js";
import counterModel from "../models/countermodel.js";
import { promises as fs } from "fs";

export default class PostService {
    create(data) {
        return new postModel(data);
    }

    async upload(author, postData, files) {
        try {
            ["participants", "price"].forEach(key => {
                postData[key] = parseInt(postData[key]);
            });
            const counter = await counterModel.findOneAndUpdate({ "$inc": { "postid": 1 } }).exec();
            let user = await userModel.findOne({ nickname: author }).exec();
            postData.postid = counter.postid;
            postData.images = files.map(x => x.filename);
            postData.location = user.location;
            postData.author = author;
            postData.email = user.email;
            postData.profileImg = files.find(x => x.originalname === postData.profileImg)?.filename;

            user.posts.push(postData.postid);

            const post = this.create(postData);
            await post.save();
            await user.save();
            return post;
        } catch (e) {
            await Promise.all(files.map(async (x) => {
                await fs.unlink(`${process.env.ROOT_DIR}/static/${x.filename}`);
            }));
            throw new Error(e.message);
        }
    }

    async delete(postid, email) {
        const post = await postModel.findOne({ postid: postid }).exec();
        if (post.email !== email)
            throw new Error("unauthorized");
        const user = await userModel.findOne({ email: email }).exec();

        await Promise.all(post.images.map(async (x) => {
            try {
                await fs.unlink(`${process.env.ROOT_DIR}/static/${x}`);
            } catch (e) {
                console.log(e.message);
            }
        }));
        const postIdx = user.posts.findIndex(x => x == post.postid);
        const likeIdx = user.likes.findIndex(x => x == post.postid);
        user.posts.splice(postIdx, 1);
        likeIdx == -1 || user.likes.splice(likeIdx, 1);

        await user.save();
        await post.deleteOne();
    }

    async likePost(postid, email) {
        const post = await postModel.findOne({ postid: postid }).exec();
        const user = await userModel.findOne({ email: email }).exec();
        if (user.likes.includes(postid))
            throw new Error("already liked");
        post.likes += 1;
        user.likes.push(postid);

        await user.save();
        await post.save();
    }

    async getRecentPosts(start, num) {
        start = parseInt(start);
        num = parseInt(num);
        const posts = await postModel.find({ postid: { $gt: start } }).sort("createdAt").limit(num).exec();
        return posts.slice(0, num);
    }

    async getPostsByCategory(category, start, num) {
        start = parseInt(start);
        num = parseInt(num);
        const posts = await postModel.find({
            postid: { $gt: start },
            category: category
        }).sort("createdAt").limit(num).exec();
        return posts;
    }

    async searchPostsByWords(str, start, num) {
        start = parseInt(start);
        num = parseInt(num);
        const posts = await postModel.find({
            postid: { $gt: start },
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
        }).sort("createdAt").limit(num).exec();
        return posts;
    }

    async getPostsByAuthor(author, start, num) {
        start = parseInt(start);
        num = parseInt(num);
        const user = await userModel.findOne({ nickname: author }).exec();
        const posts = await postModel.find({ postid: { $gt: start }, email: user?.email })
            .sort("createdAt").limit(num).exec();
        return posts;
    }

    async getPostsByFilter(email, start, num, min_price, max_price, min_dist, max_dist, sortby) {
        [start, num, min_price, max_price, min_dist, max_dist] =
            [start, num, min_price, max_price, min_dist, max_dist].map(x => parseInt(x));
        const user = await userModel.findOne({ email: email });
        const posts = await postModel.aggregate([
            {
                $geoNear: {
                    near: user.location,
                    distanceField: "dist",
                    maxDistance: max_dist,
                    minDistance: min_dist,
                    spherical: true,
                    key: "location"
                }
            },
            {
                $match: {
                    $and: [
                        { postid: { $gt: start } },
                        { price: { $gte: min_price, $lte: max_price } }
                    ]
                }
            }]).sort(sortby).limit(num).exec();
        return posts;
    }
};