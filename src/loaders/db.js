import mongoose from "mongoose";
import counterModel from "../models/countermodel.js";
import userModel from "../models/usermodel.js";

export default () => {
    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hayman42.hvgn1.mongodb.net/mydb?authSource=admin&replicaSet=atlas-149rdz-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;
    (async () => {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    })();

    const db = mongoose.connection;
    db.on("error", console.error);
    db.once("open", async () => {
        console.log(`mongodb of ${process.env.DB_USER} is open`);
        if (await counterModel.findOne().exec() == null)
            await (new counterModel()).save();
        db.emit("start");
    });
};
