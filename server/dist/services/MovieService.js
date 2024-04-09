import FileService from "../utils/FileService.js";
import jsonFileReader from "../utils/jsonFileReader.js";
const moviesPath = "./src/data/movies.json";
class MovieService {
    getAll() {
        return jsonFileReader.readFileJson(moviesPath);
    }
    ;
    getOne(movieId) {
        const movies = jsonFileReader.readFileJson(moviesPath);
        return movies.find(movie => movie.id === movieId);
    }
    ;
    create(movieData, posterFile) {
        const { title, releaseDate, trailerLink, genders } = movieData;
        const movies = jsonFileReader.readFileJson(moviesPath);
        const lastId = movies.length > 0 ? movies[movies.length - 1].id : 0;
        let poster = "no-poster.jpg";
        const newMovie = {
            id: lastId + 1,
            title,
            releaseDate,
            trailerLink,
            poster,
            genders,
        };
        if (posterFile) {
            newMovie.poster = FileService.save(posterFile);
        }
        movies.push(newMovie);
        jsonFileReader.writeFileJson(moviesPath, movies);
        return newMovie;
    }
    ;
    update(movieData, movieId, moviePoster) {
        const { title, releaseDate, trailerLink, genders } = movieData;
        const movies = jsonFileReader.readFileJson(moviesPath);
        const movieIndex = movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1)
            return undefined;
        const updatedMovie = {
            id: movieId,
            title, releaseDate, trailerLink, genders,
            poster: movies[movieIndex].poster
        };
        if (moviePoster) {
            FileService.delete(movies[movieIndex].poster);
            updatedMovie.poster = FileService.save(moviePoster);
        }
        movies[movieIndex] = updatedMovie;
        jsonFileReader.writeFileJson(moviesPath, movies);
        return updatedMovie;
    }
    ;
    delete(movieId) {
        const movies = jsonFileReader.readFileJson(moviesPath);
        const movieIndex = movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1) {
            return undefined;
        }
        FileService.delete(movies[movieIndex].poster);
        const deletedMovie = movies.splice(movieIndex, 1);
        jsonFileReader.writeFileJson(moviesPath, movies);
        return deletedMovie[0];
    }
    ;
}
export default new MovieService;
//# sourceMappingURL=MovieService.js.map