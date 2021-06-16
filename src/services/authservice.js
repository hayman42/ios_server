import jwt from "jsonwebtoken";
import axios from "axios";
import qs from "querystring";

const configs = {
    "google": {
        token_url: "https://oauth2.googleapis.com/token",
        info_url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        cid: process.env.GOOGLE_CID,
        csecret: process.env.GOOGLE_CSECRET
    },
    "kakao": {
        token_url: "https://kauth.kakao.com/oauth/token",
        info_url: "https://kapi.kakao.com/v2/user/me",
        cid: process.env.KAKAO_CID,
        csecret: process.env.KAKAO_CSECRET
    }
};

export default class AuthService {
    //for test
    async getToken(code, type) {
        const config = configs[type];
        return (await axios.post(config.token_url, qs.stringify({
            code: code,
            client_id: config.cid,
            client_secret: config.csecret,
            redirect_uri: `http://localhost:5000/api/v0/auth/register/${type}`,
            grant_type: "authorization_code"
        }))).data.access_token;
    };

    async getInfo(token, type) {
        const config = configs[type];
        let res = (await axios.get(config.info_url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })).data;

        if (type == "kakao") res = res.kakao_account;
        return res;
    };

    generateToken(email) {
        return jwt.sign({
            email: email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );
    }

    verifyToken(req, res, next) {
        if (process.env.JWT_SECRET == "test") {
            req.newToken = "test";
            return next();
        }
        const { token, email: userEmail } = req.cookies;
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        if (email != userEmail)
            throw new Error("INVALID_INFO");
        req.newToken = this.generateToken(email);
        next();
    };
};