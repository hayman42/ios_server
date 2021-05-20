import express from "express";
import testRouter from "../routes/testrouter.js";
import authRouter from "../routes/auth.js";
import postRouter from "../routes/post.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

export default app => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use("/api/v0/static", express.static(process.env.ROOT_DIR + "/static"));
    app.use("/test", testRouter);
    app.use("/api/v0/auth", authRouter);
    app.use("/api/v0/post", postRouter);
    app.get("/", (req, res) => {
        var googleurl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:5000/api/v0/auth/register/google&client_id=${process.env.GOOGLE_CID}`;
        var kakaourl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CID}&redirect_uri=http://localhost:5000/api/v0/auth/register/kakao&response_type=code`;

        res.send(`<a href="${googleurl}">구글</a>
        <a href="${kakaourl}">카카오</a>`);
        // res.sendFile(__dirname + "/resources/test.html");
    });
    return app;
};