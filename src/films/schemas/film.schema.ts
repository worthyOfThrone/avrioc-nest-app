import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, Max, Min } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { Genre } from 'src/genres/schemas/genre.schema';
import { Timestamps } from 'src/helpers/interfaces/timestamp.interface';
import { Review } from 'src/reviews/schemas/review.schema';

export type FilmsDocument = Film & Document & Timestamps;

@Schema({ collection: 'films', timestamps: true })
export class Film {
	@Prop({ require: true, unique: true })
	name: string;

	@Prop({ require: true })
	description: string;

	@Prop({ require: true })
	releaseDate: Date;

	@Prop({ required: false, nullable: true })
	@IsNumber()
	@Min(1)
	@Max(5)
	rating?: number; // number between 1 to 5

	@Prop({ require: true })
	country: string;

	@Prop([
		{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
	])
	reviews?: Review[];

	@Prop([
		{ required: false, type: mongoose.Schema.Types.ObjectId, ref: Genre.name },
	])
	genres?: Genre[];

	@Prop({ require: false })
	photo?: string; // url
}

export const FilmsSchema = SchemaFactory.createForClass(Film);
