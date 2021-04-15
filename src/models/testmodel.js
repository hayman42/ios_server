import mongoose from "mongoose";

export default mongoose.model("test", new mongoose.Schema({
    msg: { type: String, required: true }
}, {
    timestamps: true
}));