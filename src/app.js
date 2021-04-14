import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRouter from "./routers/test";
import authRouter from "./routers/auth"

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
app.use("/api/v0", testRouter);
app.use("/api/v0", authRouter);
app.get("/", (req, res) => {
    console.log(process.env.ROOT_DIR);
    res.sendFile(process.env.ROOT_DIR + "/src/resources/index.html")
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;