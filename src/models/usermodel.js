import mongoose from "mongoose";

export default mongoose.model("users", new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    posts: [Number],
    likes: [Number],
    participated: [Number],
    privateKey: { type: String }
}, {
    timestamps: true
}));
