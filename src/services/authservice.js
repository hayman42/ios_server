import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default {
    async register(code, type) {
        try {
            var authinfo = await axios("https://oauth2.googleapis.com/token", {
                code: code,
                client_id: process.env.GOOGLE_CID,
                client_secret: process.env.GOOGLE_CSECRET,
                redirect_uri: "http://localhost:5000/api/v0/register-google",
                grant_type: "authorization_code"
            });
            var accessToken = authinfo.access_token;
            var email = await axios(`https://www.googleapis.com/auth/userinfo.email?access_token=${accessToken}`);
            console.log(email.email);
            return "ok";
        } catch (e) {
            console.log("error");
            return "e";
        }
    }
};