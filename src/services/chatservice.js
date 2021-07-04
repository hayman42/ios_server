import userModel from "../models/usermodel";

export default class ChatService {
    async joinChatroom(postid, email) {
        let user = await userModel.findOne({ email: email });
        user.chatroomList.push(postid);
        await user.save();
        return user;
    }

    async getMemberList(postid) {
        return await userModel.find({ chatroomList: postid });
    }

    async quitChatroom(postid, email) {
        let user = await userModel.findOne({ email: email });
        const idx = user.chatroomList.indexOf(postid);
        user.chatroomList.splice(idx, 1);
        await user.save();
        return user;
    }
};