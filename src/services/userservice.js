import userModel from "../models/usermodel";

export default class UserService {
    async find(email, name) {
        return await userModel.findOne({ email: email, name: name });
    }

    async save(user) {
        return await user.save();
    };

    create(data) {
        return new userModel(data);
    }

    async delete(user) {
        return await userModel.deleteOne({ _id: user._id });
    }

    async checkAndCreate(email, name, type) {
        const checkExist = await this.find(email, name);
        if (checkExist !== null)
            return checkExist;
        const user = this.create({ email: email, name: name, authProvider: type });
        return await this.save(user);
    }
}