import apn from "apn";
import userModel from "../models/usermodel";

let option = {
    token: {
        key: process.env.APN_KEY_DIR,
        keyId: process.env.APN_KEY_ID,
        teamId: process.env.APN_TEAM_ID
    },
    production: false
};
let apnProvider = new apn.Provider(option);

export default class ApnService {
    async sendPush(msg, dest) {
        let note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = msg;
        note.topic = "Develop.com-GDONG";
        let sendTo = await userModel.findOne({ nickname: dest }).exec();

        const result = await apnProvider.send(note, [sendTo.deviceToken]);
        return result;
    }
};