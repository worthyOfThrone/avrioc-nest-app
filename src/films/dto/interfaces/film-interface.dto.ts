import { Genre } from 'src/genres/schemas/genre.schema';
import { Review } from 'src/reviews/schemas/review.schema';

export class FilmsDetail {
	id: string;
	name: string;
	description: string;
	releaseDate: Date;
	rating?: number; 
	country: string;
	reviews?: Review[];
	genres?: Genre[];
	photo?: string;
	updatedAt: Date;
	createdAt: Date;
}

export enum fieldsToPopulateFilmObject {
	reviews = 'reviews',
	genres = 'genres',
}
