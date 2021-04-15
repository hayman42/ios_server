import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRouter from "./routers/test";
import authRouter from "./routers/auth";

const app = express()
var port = process.env.PORT || 5000;
dotenv.config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hayman42.hvgn1.mongodb.net/mydb?authSource=admin&replicaSet=atlas-149rdz-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error);
db.once("open", () => {
    console.log(`mongodb of ${process.env.DB_USER} is open`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v0/test", testRouter);
app.use("/api/v0/auth", authRouter);
app.get("/", (req, res) => {
    var googleurl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:5000/api/v0/auth/register/google&client_id=${process.env.GOOGLE_CID}`;
    var kakaourl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CID}&redirect_uri=http://localhost:5000/api/v0/auth/register/kakao&response_type=code`;

    res.send(`<a href="${googleurl}">구글</a>
    <a href="${kakaourl}">카카오</a>`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});