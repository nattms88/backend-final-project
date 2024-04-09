import MovieService from "../services/MovieService.js";
import MovieModel from "../models/MovieModels.js";
const moviesPath = "./src/data/movies.json";
class MovieController {
    async getAllMovies(req, res) {
        try {
            const movies = await MovieModel.find();
            return res.json(movies);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    ;
    async getMovieById(req, res) {
        try {
            const movie = await MovieModel.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found.' });
            }
            return res.json(movie);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    ;
    createMovie(req, res) {
        var _a;
        try {
            const newMovie = MovieService.create(req.body, (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster);
            return res.status(201).json(newMovie);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    ;
    updateMovie(req, res) {
        var _a;
        const movieId = parseInt(req.params.id);
        const updatedMovie = MovieService.update(req.body, movieId, (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster);
        if (!updatedMovie)
            return res.status(404).json({ error: "Movie not found." });
        return res.json(updatedMovie);
    }
    ;
    async deleteMovie(req, res) {
        try {
            const movieId = req.params.id;
            const deletedMovie = await MovieModel.findByIdAndDelete(movieId);
            if (!deletedMovie) {
                return res.status(404).json({ error: 'Movie not found.' });
            }
            if (deletedMovie.poster !== "defaultMovie.png") {
                MovieService.delete(deletedMovie.poster);
            }
            return res.json({ message: "Movie deleted successfully!" });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
}
export default new MovieController;
//# sourceMappingURL=MovieController.js.map