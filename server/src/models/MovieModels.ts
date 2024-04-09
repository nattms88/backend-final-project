import mongoose from "mongoose";

export interface IMovie extends mongoose.Document {
    title: string;
    releaseDate: string;
    trailerLink: string;
    poster?: string;
    genders: string;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        title:
 *          type: string
 *        releaseDate:
 *          type: string
 *        trailerLink:
 *          type: string
 *        poster:
 *          type: string
 *        genders:
 *          type: string
 *        isActive:
 *          type: boolean
 */

const movieSchema = new mongoose.Schema({
        title: {type:String, required: true},
        releaseDate: {type:String, required: true},
        trailerLink: {type:String, required: true},
        poster: {type:String, default:"defaultMovie.png"},
        genders: {type:String, required: true},

    });

export default mongoose.model<IMovie>("Movie", movieSchema);
