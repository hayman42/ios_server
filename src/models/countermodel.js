import mongoose from "mongoose";

export default mongoose.model("counters", new mongoose.Schema({
    postid: { type: Number, required: true, default: 0 }
}));