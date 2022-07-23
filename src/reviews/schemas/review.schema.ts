import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Film } from "src/films/schemas/film.schema";
import { User } from "src/users/schemas/user.schema";

export type ReviewDocument = Review & Document;

@Schema({ collection: 'Reviews', timestamps: true})
export class Review {
    @Prop({ required: true })
    rating: string;

    @Prop({ nullable: true })
    comment?: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Film.name })
    filmId: Film;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    reviewerId: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);