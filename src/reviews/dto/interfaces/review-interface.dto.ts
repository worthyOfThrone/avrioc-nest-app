import { Film } from 'src/films/schemas/film.schema';
import { User } from 'src/users/schemas/user.schema';

export class ReviewsDetail {
	id: string;
	rating: number;
	comment?: string;
	filmId: Film;
	reviewerId: User;
	createdAt: Date;
	updatedAt: Date;
}

export enum fieldsToPopulateReviewObject {
	filmId = 'filmId',
	reviewerId = 'reviewerId',
}
export const fieldsToPopulateReviewArray = Object.keys(
	fieldsToPopulateReviewObject,
);
