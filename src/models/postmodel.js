import mongoose from "mongoose";

export default mongoose.model("posts", new mongoose.Schema({
    postid: { type: Number, required: true, unique: true },
    author: { type: mongoose.SchemaTypes.ObjectId, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    location: { type: String, required: true },
    participants: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    likes: { type: Number, default: 0, required: true }
}, {
    timestamps: true
}));
