import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { GenresService } from 'src/genres/genres.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

import { AddExistingResourcesToFilm } from './dto/add-existing-resources-to-film.dto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsService } from './films.service';
import { VerifyResource } from './helpers/verify-resource.service';
import { Film } from './schemas/film.schema';

@Controller('films')
export class FilmsController {
	constructor(
		private readonly filmsService: FilmsService,
		private readonly genresService: GenresService,
		private readonly reviewsService: ReviewsService,
		private readonly usersService: UsersService,
	) {}

	@Get(':filmId')
	async getFilm(@Param('filmId') filmId: string): Promise<Film> {
		return this.filmsService.getFilmById(filmId);
	}

	@Get(':name')
	async getFilmByName(@Param('filmName') filmName: string): Promise<Film[]> {
		const film = await this.filmsService.getFilmsbyFilmName(filmName);
		if (!film) {
			throw new HttpException(`the resource with name ${filmName} does not exist`, 404);
		}
		return film;
	}

	@Get()
	async getFilms(): Promise<Film[]> {
		return this.filmsService.getFilms();
	}

	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	async createFilm(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
		const { genres, releaseDate, reviews } = createFilmDto;
		if (releaseDate) {
			createFilmDto.releaseDate = new Date(releaseDate);
		}

		const genresResources = new VerifyResource(this.genresService);
		const allGenresVerified = genresResources.verifyResource(genres);

		// do we want to add existing reviews ??
		const reviewsResources = new VerifyResource(this.reviewsService);
		const allReviewsVerified = reviewsResources.verifyResource(reviews);

		if (
			!genres.length ||
			!reviews.length ||
			(allGenresVerified && allReviewsVerified)
		) {
			return this.filmsService.createFilm(createFilmDto);
		}
	}

	@Post('/addResources')
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	async addGenresToFilm(
		@Body() addExistingGenresToFilm: AddExistingResourcesToFilm,
	): Promise<Film> {
		const { genres, review, filmId } = addExistingGenresToFilm;
		// very the list of genre is objectId or not
		const genresResources = new VerifyResource(this.genresService);
		const allGenresVerified = genresResources.verifyResource(genres);

		// check if a user is reviewer
		let isReviewer = false;
		if (review && Object.keys(review).length) {
			const user = (await this.usersService.getUserById(
				review.reviewerId,
			)) as UserDocument;
			if (!user || !user.isReviewer) {
				throw new HttpException('permission to write review is denied', 501);
			}
			isReviewer = user.isReviewer;
			review.filmId = filmId;
		}


		if (allGenresVerified) {
			return this.filmsService.addResourcesToFilm({
				...addExistingGenresToFilm,
				// override the reviews
				review,
			});
		}

		// throw exception based on verification
	}

	@Patch(':filmId')
	async updateFilm(
		@Param('filmId') filmId: string,
		@Body() updateFilmDto: UpdateFilmDto,
	): Promise<Film> {
		return this.filmsService.updateFilm(filmId, updateFilmDto);
	}
}
