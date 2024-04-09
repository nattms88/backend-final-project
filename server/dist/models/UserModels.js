import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=UserModels.js.map