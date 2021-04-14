import mongoose from "mongoose";

const testmodelSchema = new mongoose.Schema({
    email: { type: String, required: true },
    loginType: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String }
}, {
    timestamps: true
});

export default mongoose.model("Usermodel", testmodelSchema);