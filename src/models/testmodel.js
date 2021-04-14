import mongoose from "mongoose";

const testmodelSchema = new mongoose.Schema({
    msg: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model("Testmodel", testmodelSchema);