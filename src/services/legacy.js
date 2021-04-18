import axios from "axios";
import qs from "querystring";
import dotenv from "dotenv";

dotenv.config();
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

async function getTokens(code, type) {
    const config = configs[type];

    return (await axios.post(config.token_url, qs.stringify({
        code: code,
        client_id: config.cid,
        client_secret: config.csecret,
        redirect_uri: `http://localhost:5000/api/v0/auth/register/${type}`,
        grant_type: "authorization_code"
    }))).data;
};

async function getInfo(type, token) {
    const config = configs[type];
    var res = (await axios.get(config.info_url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).data;

    if (type == "kakao") res = res.kakao_account;
    return res;
};