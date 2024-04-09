import { Router } from "express";
import { check } from 'express-validator';
import MovieController from "../controllers/MovieController.js";
const router = Router();
router.get('/movies', MovieController.getAllMovies);
router.get('/movies/:id', MovieController.getMovieById);
router.post('/movies', [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('trailerLink').notEmpty().withMessage('Movie trailerLink is required'),
], MovieController.createMovie);
router.put('/movies/:id', [
    check('title').notEmpty().withMessage('Movie title is required'),
    check('trailerLink').notEmpty().withMessage('Movie trailerLink is required'),
], MovieController.updateMovie);
router.delete('/movies/:id', MovieController.deleteMovie);
export default router;
//# sourceMappingURL=movieRouter.js.map