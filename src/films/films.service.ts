import { HttpException, Injectable } from '@nestjs/common';
import { Genre } from 'src/genres/schemas/genre.schema';
import { Review } from 'src/reviews/schemas/review.schema';
import { Resource } from './helpers/add-genre.service';
import { AddExistingResourcesToFilm } from './dto/add-existing-resources-to-film.dto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { Film } from './schemas/film.schema';
import { ReviewsResource } from './helpers/add-reviews.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';

@Injectable()
export class FilmsService {
	constructor(
		private readonly filmsRepository: FilmsRepository,
		private readonly reviewsService: ReviewsService,
	) {}

	async getFilmById(_id: string): Promise<Film> {
		const res = await this.filmsRepository.findOne({ _id });
		if (!res) throw new HttpException(`the resource with id ${_id} doesn't exist`, 404);
		return res.populate(['reviews', 'genres']);
	}

	async getFilmsbyFilmName(name: string): Promise<Film[]> | null {
		const film = await this.filmsRepository.find({ name });
		if (!film) return null;
		return film;
	}

	async getFilms(): Promise<Film[]> {
		return await this.filmsRepository.find({}, ['reviews', 'genres']);
	}

	async createFilm(createFilmDto: CreateFilmDto): Promise<Film> {
		return this.filmsRepository.create(createFilmDto);
	}

	async updateFilm(filmId: string, filmUpdates: UpdateFilmDto): Promise<Film> {
		return this.filmsRepository.findOneAndUpdate({ _id: filmId }, filmUpdates);
	}

	async addResourcesToFilm(
		filmUpdates: AddExistingResourcesToFilm,
	): Promise<Film> {
		const { genres, review, filmId } = filmUpdates;
		const existingFilm = await this.filmsRepository.findOne({ _id: filmId });
		const filmWithResources: Partial<Film> = {};

		// add the genre ids into the film object
		if (genres && genres.length) {
			const genreResource = new Resource(existingFilm.genres, genres);
			filmWithResources.genres = genreResource.addResources() as Genre[];
		}

		// create or update the review by film id and reviewer id, and add the ids back to the film object
		if (review) {
			const reviewsResource = new ReviewsResource(review as CreateReviewDto, this.reviewsService);
			const isExisted = await reviewsResource.ifExistis();
			if (existingFilm && existingFilm.reviews.length && isExisted) {
				// update the review
				await reviewsResource.updateResources();
			} else {
				// add the reviews
				await reviewsResource.createResources() as Review;
				filmWithResources.reviews = reviewsResource.addResources(existingFilm.reviews) as Review[];
			}
		}
		// save the film object to DB
		return await this.filmsRepository.findOneAndUpdate({ _id: filmId }, filmWithResources);
	}

	// NEXT steps: update the above function to extend it for other resource
	// add remove resource function
	// continue
}
