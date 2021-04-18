import userModel from "../models/usermodel";
import postModel from "../models/postmodel";
import counterModel from "../models/countermodel";
import { promises as fs } from "fs";

export default {
    async upload(_id, postData, files) {
        Object.keys(postData).map((key) => {
            postData[key] = parseInt(postData[key]) || postData[key];
        });
        const counter = await counterModel.findOneAndUpdate({ "$inc": { "postid": 1 } }).exec();
        var user = await userModel.findOne({ _id: _id }).exec();
        postData.postid = counter.postid;
        postData.images = files.map((x) => x.path.split('\\')[2]);
        postData.location = user.location;
        postData.author = _id;

        user.posts.push(postData.postid);
        user.participated.push(postData.postid);

        try {
            const post = await new postModel(postData).save();
            await user.updateOne();
            return {
                status: 200,
                data: post.postid
            };
        } catch (e) {
            return {
                status: 500,
                data: {
                    msg: "save error"
                }
            };
        }
    },
    async delete(postid, token) {
        const post = await postModel.findOne({ postid: postid });
        if (post == null)
            return {
                status: 404,
                data: {
                    msg: "no such post"
                }
            };
        const user = await userModel.findOne({ privateKey: token });
        if (!post.author.equals(user._id))
            return {
                status: 401,
                data: {
                    msg: "unauthorized"
                }
            };

        post.images.forEach(async (x) => { await fs.unlink(`${process.env.ROOT_DIR}/src/static/${x}`); });
        await post.deleteOne();
        return {
            status: 200,
            data: {
                msg: "delete success"
            }
        };
    }
};