import userModel from "../models/usermodel.js";
import { promises as fs } from "fs";

export default class UserService {
    create(data) {
        return new userModel(data);
    }

    point(longitude, latitude) {
        return { type: "Point", coordinates: [longitude, latitude] };
    }

    async checkAndCreate(email, name, type, device_token) {
        const checkExist = await userModel.findOne({ email: email });
        if (checkExist === null) {
            let user = this.create({ email: email, name: name, authProvider: type, deviceToken: device_token });
            user.nickname = user._id;
            user.location = this.point(-1, -1);
            await user.save();
            return { isNew: true, user: user };
        }
        else if (checkExist.authProvider !== type)
            throw new Error(`email exists at ${checkExist.authProvider}`);

        checkExist.deviceToken = device_token;
        await checkExist.save();
        return { isNew: false, user: checkExist };
    }

    async quitUser(email) {
        const user = await userModel.findOne({ email: email }).exec();
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

    async setNickname(user, nickname) {
        if (nickname) {
            if (await userModel.findOne({ nickname: nickname }))
                throw new Error("nickname already exists");
            await this.updateFollowInfo(user.nickname, nickname);
            user.nickname = nickname;
        }
        return user;
    }

    setLocation(user, longitude, latitude) {
        if (longitude && latitude) {
            user.location = this.point(parseFloat(longitude), parseFloat(latitude));
        }
        return user;
    }

    async setProfileImg(user, delete_img, file) {
        if (file.length == 1) {
            user.profileImg && await fs.unlink(`${process.env.ROOT_DIR}/static/${user.profileImg}`);
            user.profileImg = file[0].filename;
        }
        else if (file.length == 0 && delete_img === "true") {
            await fs.unlink(`${process.env.ROOT_DIR}/static/${user.profileImg}`);
            user.profileImg = "";
        }
        else if (file.length > 1)
            throw new Error("multiple images found");
        return user;
    }

    async updateUserInfo(email, nickname, longitude, latitude, delete_img, file) {
        try {
            let user = await userModel.findOne({ email: email }).exec();
            await this.setNickname(user, nickname);
            this.setLocation(user, longitude, latitude);
            await this.setProfileImg(user, delete_img, file);
            await user.save();
            return user;
        } catch (e) {
            await Promise.all(file.map(async (x) => {
                await fs.unlink(`${process.env.ROOT_DIR}/static/${x.filename}`);
            }));
            throw new Error(e);
        }
    }

    async followUser(email, nickname) {
        let user = await userModel.findOne({ email: email });
        if (user.following.includes(nickname)) {
            throw new Error(`already following ${nickname}`);
        }
        let friend = await userModel.findOne({ nickname: nickname });

        user.following.push(nickname);
        friend.followers.push(user.nickname);
        await user.save();
        await friend.save();
    }

    async unfollowUser(email, nickname) {
        let user = await userModel.findOne({ email: email });
        if (!(user.following.includes(nickname))) {
            throw new Error(`${nickname} is not in the following list`);
        }
        let friend = await userModel.findOne({ nickname: nickname });
        const idx1 = user.following.indexOf(nickname);
        const idx2 = friend.followers.indexOf(user.nickname);

        user.following.splice(idx1, 1);
        friend.followers.splice(idx2, 1);
        await user.save();
        await friend.save();
    }

    async updateFollowInfo(nickname, newname) {
        let followedBy = await userModel.find({ following: nickname }).exec();
        let following = await userModel.find({ followers: nickname }).exec();
        await Promise.all(
            followedBy.map(async user => {
                const idx = user.following.indexOf(nickname);
                user.following[idx] = newname;
                await user.save();
            })
        );
        await Promise.all(
            following.map(async user => {
                const idx = user.followers.indexOf(nickname);
                user.followers[idx] = newname;
                await user.save();
            })
        );
    }
}