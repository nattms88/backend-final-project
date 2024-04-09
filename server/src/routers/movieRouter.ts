import { Router } from "express";
import { check } from 'express-validator';
import MovieController from "../controllers/MovieController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints for managing movies
 */

/**
 * @swagger
 * /api/movies:
 *   get:   
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Movies'
 */

// Get all movies
router.get('/movies', MovieController.getAllMovies);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Movie title
 *       - in: query
 *         name: releaseDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Release date (DD-MM-YYYY)
 *       - in: query
 *         name: genders
 *         schema:
 *           type: string
 *         required: false
 *         description: Genders (Separated by commas)
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/MovieInput'
 */
// Search movie
router.get('/movies/search', authenticateToken, MovieController.searchMovies);

/**
 * @swagger
 * /api/movies/:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *     responses:
 *       201:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 */

// Create a new movie
router.post(
  '/movies',
  [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('trailerLink').notEmpty().withMessage('Movie trailer link is required'),
    check('genders').notEmpty().withMessage('Movie genders are required'),
  ],
  MovieController.createMovie
);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The movie was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 */

// Update an existing movie
router.put(
  '/movies/:id',
  [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('trailerLink').notEmpty().withMessage('Movie trailer link is required'),
  ],
  MovieController.updateMovie
);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete an existing movie
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The movie was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 */

// Delete an existing movie
router.delete('/movies/:id', MovieController.deleteMovie);


export default router;
