import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Film } from 'src/films/schemas/film.schema';
import { Timestamps } from 'src/helpers/interfaces/timestamp.interface';
import { User } from 'src/users/schemas/user.schema';

export type ReviewDocument = Review & Document & Timestamps;

@Schema({ collection: 'reviews', timestamps: true })
export class Review {
  @Prop({ required: true })
  rating: number;

  @Prop({ nullable: true, required: false })
  comment?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Film.name,
  })
  filmId: Film;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  reviewerId: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
