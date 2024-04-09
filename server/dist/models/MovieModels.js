import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    releaseDate: { type: String, required: true },
    trailerLink: { type: String, required: true },
    poster: { type: String, default: "defaultMovie.png" },
    genders: { type: String, required: true },
});
export default mongoose.model("Movie", movieSchema);
//# sourceMappingURL=MovieModels.js.map