import mongoose from "mongoose";

export default mongoose.model("users", new mongoose.Schema({
    email: { type: String, required: true },
    loginType: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String }
}, {
    timestamps: true
}));
