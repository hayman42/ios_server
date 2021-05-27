import userModel from "../models/usermodel.js";

export default class UserService {
    create(data) {
        return new userModel(data);
    }

    async checkAndCreate(email, name, type) {
        const checkExist = await userModel.findOne({ name: name });
        if (checkExist === null) {
            const user = this.create({ email: email, name: name, authProvider: type });
            return await user.save();
        }

        if (checkExist.email !== email)
            throw new Error(`name: ${name} already exists`);
        else if (checkExist.authProvider !== type)
            throw new Error(`invalid auth provider`);
        return checkExist;
    }

    async quitUser(email, name) {
        const user = await userModel.findOne({ email: email, name: name });
        if (user == null)
            throw new Error("no such user");
        await user.deleteOne();
    }

    async getUserInfo(name) {
        const user = await userModel.findOne({ name: name }).exec();
        if (user == null)
            throw new Error("no such user");
        return user;
    }
}