import mongoose from "mongoose";

export default mongoose.model("users", new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    authProvider: { type: String, required: true },
    profileImageUrl: { type: String },
    location: { type: String },
    posts: [Number],
    likes: [Number],
    participated: [Number]
}, {
    timestamps: true
}));