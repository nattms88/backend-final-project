import { validationResult } from "express-validator";
import fileService from "../utils/FileService.js";
import { Request, Response } from "express";
import MovieModel from "../models/MovieModels.js";


const moviesPath = "./src/data/movies.json";

class MovieController {
  async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await MovieModel.find();
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Forbidden access. Only admins can create movies." });
      }
      
      const { title, releaseDate, trailerLink, genders } = req.body;
      const foundMovie = await MovieModel.findOne({ title });
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      if (foundMovie) {
        return res.status(400).json({ error: "Movie already exists." });
      }

      let poster = "defaultMovie.png";

      if (req.files?.poster) {
        poster = fileService.save(req.files?.poster);
      }
      const newMovie = new MovieModel({
        title,
        releaseDate,
        trailerLink,
        genders,
        poster,
      });

      await newMovie.save();

      return res.status(201).json(newMovie);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async updateMovie(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Forbidden access. Only admins can update movies." });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { title, releaseDate, trailerLink, genders } = req.body;
      const movie = await MovieModel.findById(req.params.id);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }

      let poster = movie.poster;

      if (req.files?.poster) {
        if (movie.poster && movie.poster !== "defaultMovie.png") {
          fileService.delete(movie.poster);
        }
        poster = fileService.save(req.files?.poster);
      }

      movie.title = title;
      movie.releaseDate = releaseDate;
      movie.trailerLink = trailerLink;
      movie.genders = genders;
      movie.poster = poster;

      await movie.save();

      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async searchMovies(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: Please log in to search movies." });
      }

      const { title, genres, releaseDate, page = 1, limit = 10 } = req.query as any;
      const query: any = {};

      if (title) query.title = new RegExp(title, 'i');
      if (genres) query.genres = new RegExp(genres, 'i');
      if (releaseDate) query.releaseDate = releaseDate;

      const movies = await MovieModel.find(query)
        .sort({ releaseDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  }

  async deleteMovie(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Forbidden access. Only admins can delete movies." });
      }
      const movieId = req.params.id;
      const deletedMovie: any = await MovieModel.findByIdAndDelete(movieId);
      if (!deletedMovie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      if (deletedMovie.poster !== "defaultMovie.png") {
        fileService.delete(deletedMovie.poster);
      }
      return res.json({ message: "Movie deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }
}

export default new MovieController();
