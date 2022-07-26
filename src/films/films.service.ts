import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Genre } from 'src/genres/schemas/genre.schema';
import { Review } from 'src/reviews/schemas/review.schema';
import { Resource } from './helpers/add-genre.service';
import { AddExistingResourcesToFilm } from './dto/add-existing-resources-to-film.dto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { Film, FilmsDocument } from './schemas/film.schema';
import { ReviewsResource } from './helpers/add-reviews.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { FilmsDetail } from './dto/interfaces/film-interface.dto';

@Injectable()
export class FilmsService {
	constructor(
		private readonly filmsRepository: FilmsRepository,
		private readonly reviewsService: ReviewsService,
	) {}
	_getFilmsDetail(film: FilmsDocument): FilmsDetail {
		return {
			id: film._id,
			name: film.name,
			description: film.description,
			releaseDate: film.releaseDate,
			rating: film.rating,
			country: film.country,
			reviews: film.reviews,
			genres: film.genres,
			photo: film.photo,
			createdAt: film.createdAt,
			updatedAt: film.updatedAt,
		};
	}

	async getFilmById(_id: string): Promise<FilmsDetail> | null {
		const film = await this.filmsRepository.findOne({ _id });
		if (!film) return null;

		await film.populate(['reviews', 'genres']);
		return this._getFilmsDetail(film);
	}

	async getFilmsbyFilmName(name: string): Promise<FilmsDetail[]> {
		const films = await this.filmsRepository.find({ name }, [
			'reviews',
			'genres',
		]);
		return films.map((film) => this._getFilmsDetail(film));
	}

	async getFilms(): Promise<FilmsDetail[]> {
		const films = await this.filmsRepository.find({}, ['reviews', 'genres']);
		return films.map((film) => this._getFilmsDetail(film));
	}

	async createFilm(createFilmDto: CreateFilmDto): Promise<FilmsDetail> {
		const { name } = createFilmDto;
		const existingFilm = await this.getFilmsbyFilmName(name);
		if (existingFilm.length)
			throw new HttpException(
				`cannot create the existing film with ${name}`,
				HttpStatus.BAD_REQUEST,
			);
		const film = await this.filmsRepository.create(createFilmDto);
		return this._getFilmsDetail(film);
	}

	async updateFilm(filmId: string, filmUpdates: UpdateFilmDto): Promise<Film> {
		const film = await this.getFilmById(filmId);
		if (!film)
			throw new HttpException(
				`the resource with id ${filmId} does not exists`,
				HttpStatus.BAD_REQUEST,
			);
		return this.filmsRepository.findOneAndUpdate({ _id: filmId }, filmUpdates);
	}

	async addResourcesToFilm(
		filmUpdates: AddExistingResourcesToFilm,
	): Promise<FilmsDetail> {
		const { genres, review, filmId } = filmUpdates;
		const existingFilm = await this.filmsRepository.findOne({ _id: filmId });
		const filmWithResources: Partial<Film> = {};
		const plainExistingIds = existingFilm.genres.map((g) => String(g));

		// add the genre ids into the film object
		if (genres && genres.length) {
			const genreResource = new Resource(plainExistingIds, genres);
			filmWithResources.genres =
				genreResource.addResources() as unknown as Genre[];
		}

		// create or update the review by film id and reviewer id, and add the ids back to the film object
		if (review) {
			const reviewsResource = new ReviewsResource(
				review as CreateReviewDto,
				this.reviewsService,
			);
			const isExisted = await reviewsResource.ifExistis();
			if (existingFilm && existingFilm.reviews.length && isExisted) {
				// update the review
				await reviewsResource.updateResources();

			} else {
				// add the reviews
				(await reviewsResource.createResources()) as Review;
				filmWithResources.reviews = reviewsResource.addResources(
					existingFilm.reviews,
				) as Review[];
			}

			const ratingArray = await (
				await this.reviewsService.getReviewsbyFilmId(filmId)
			).map((r) => r.rating);
			const ratingAvg =
				ratingArray.reduce((sum, review) => sum + review, 0) /
				ratingArray.length;
			filmWithResources.rating = ratingAvg || null;
		}
		// save the film object to DB
		const finalResult = await this.filmsRepository.findOneAndUpdate(
			{ _id: filmId },
			filmWithResources,
		);

		await finalResult.populate(['reviews', 'genres']);
		return this._getFilmsDetail(finalResult);
	}

	// NEXT steps: update the above function to extend it for other resource
	// add remove resource function
}
