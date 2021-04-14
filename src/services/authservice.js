import axios from "axios";
import dotenv from "dotenv";
import Usermodel from "../models/usermodel";

dotenv.config();

export default {
    async register(code, type) {
        var authInfo = (await axios.post("https://oauth2.googleapis.com/token", {
            code: code,
            client_id: process.env.GOOGLE_CID,
            client_secret: process.env.GOOGLE_CSECRET,
            redirect_uri: "http://localhost:5000/api/v0/register-google",
            grant_type: "authorization_code"
        })).data;
        var userInfo = (await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${authInfo.access_token}`)).data;

        if (await Usermodel.findOne({ email: userInfo.email + "asdf" }).exec() !== null)
            return null;
        var userModel = new Usermodel({
            email: userInfo.email + "hello",
            loginType: type,
            accessToken: authInfo.access_token,
            refreshToken: authInfo.refresh_token
        });

        return await userModel.save();
    }
};