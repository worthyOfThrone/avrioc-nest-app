import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Genre } from "src/genres/schemas/genre.schema";
import { Review } from "src/reviews/schemas/review.schema";

export type FilmsDocument = Film & Document;

@Schema({ collection: 'Films', timestamps: true})
export class Film {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    releaseDate: Date;
 
    @Prop()
    rating: number; // number between 1 to 5
 
    @Prop()
    country: string;
 
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }])
    reviews: Review[];
 
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Genre.name }])
    genres: Genre[];
 
    @Prop()
    photo: string; // url
}

export const FilmsSchema = SchemaFactory.createForClass(Film);