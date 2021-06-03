import userModel from "../models/usermodel.js";

export default class UserService {
    create(data) {
        return new userModel(data);
    }

    async checkAndCreate(email, name, type) {
        const checkExist = await userModel.findOne({ email: email });
        if (checkExist === null) {
            let user = this.create({ email: email, name: name, authProvider: type });
            user.nickname = user._id;
            await user.save();
            return { isNew: true, user: user };
        }
        else if (checkExist.authProvider !== type)
            throw new Error(`email exists at ${checkExist.authProvider}`);
        return { isNew: false, user: checkExist };
    }

    async quitUser(email) {
        const user = await userModel.findOne({ email: email });
        if (user == null)
            throw new Error("no such user");
        await user.deleteOne();
    }

    async getUserInfo(email) {
        const user = await userModel.findOne({ email: email }).exec();
        if (user == null)
            throw new Error("no such user");
        return user;
    }

    async updateUserInfo(email, updateInfo) {
        if (updateInfo.longitude)
            updateInfo.longitude = parseFloat(updateInfo.longitude);
        if (updateInfo.longitude)
            updateInfo.latitude = parseFloat(updateInfo.longitude);
        if (updateInfo.nickname) {
            if (await userModel.findOne({ nickname: updateInfo.nickname }))
                throw new Error("nickname already exists");
        }
        let user = await userModel.findOne({ email: email }).exec();
        await user.updateOne(updateInfo).exec();
        return user;
    }
}