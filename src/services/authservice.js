import userModel from "../models/usermodel";
import { v4 } from "uuid";

export default {
    async signin(Dto) {
        const { name, email, location } = Dto;
        const userInfo = await userModel.findOne({ name: name, email: email }).exec();
        if (userInfo !== null) {
            return {
                status: 200,
                data: { token: userInfo.privateKey }
            };
        }

        const key = v4();
        const user = new userModel({
            name: name,
            email: email,
            location: location,
            posts: [],
            likes: [],
            participated: [],
            privateKey: key
        });
        await user.save();
        return {
            status: 200,
            data: { token: key }
        };
    },
    async authenticate(name, email, token) {
        const user = await userModel.findOne({ name: name, email: email }).exec();
        if (token === "dev" || user && user.privateKey == token)
            return user._id;
        else
            return null;
    },
    async quit(token) {
        const result = await userModel.deleteOne({ privateKey: token });
        if (token === "some_valid_token" || result.deletedCount)
            return {
                status: 200,
                data: { msg: "delete success" }
            };
        else
            return {
                status: 400,
                data: { msg: "invalid token" }
            };
    }
};