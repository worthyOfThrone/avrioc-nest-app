import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	PermissionDeniedResponse,
	ResourceNotFoundResponse,
	UnAuthorizedResponse,
} from 'src/auth/dto/interfaces/auth-error-interface.dto';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { GenresService } from 'src/genres/genres.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

import { AddExistingResourcesToFilm } from './dto/add-existing-resources-to-film.dto';
import {
	AllFilmDetailsResponse,
	CreateFilmDto,
	FilmDetailsResponse,
} from './dto/create-film.dto';
import { FilmsDetail } from './dto/interfaces/film-interface.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsService } from './films.service';
import { VerifyResource } from './helpers/verify-resource.service';
import { Film } from './schemas/film.schema';

@ApiTags('Film Module')
@Controller('films')
export class FilmsController {
	constructor(
		private readonly filmsService: FilmsService,
		private readonly genresService: GenresService,
		private readonly usersService: UsersService,
	) {}

	@UseGuards(JwtGuard)
	@Get(':filmId')
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'get film by id' })
	@ApiNotFoundResponse({
		description: 'film does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'film detail of respective id',
		type: FilmDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getFilm(@Param('filmId') filmId: string): Promise<FilmsDetail> {
		const film = await this.filmsService.getFilmById(filmId);
		if (!film) {
			throw new HttpException(
				`the resource with id ${filmId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return film;
	}

	@UseGuards(JwtGuard)
	@Get('byName/:filmName')
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'get film by name' })
	@ApiNotFoundResponse({
		description: 'film does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'film detail of respective name',
		type: AllFilmDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getFilmByName(
		@Param('filmName') filmName: string,
	): Promise<AllFilmDetailsResponse> {
		const films = await this.filmsService.getFilmsbyFilmName(filmName);
		if (!films) {
			throw new HttpException(
				`the resource with name ${filmName} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return { films };
	}

	@UseGuards(JwtGuard)
	@Get()
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'get all films' })
	@ApiOkResponse({
		description: 'film details array',
		type: AllFilmDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getFilms(): Promise<AllFilmDetailsResponse> {
		const films = await this.filmsService.getFilms();
		return { films };
	}

	@UseGuards(JwtGuard)
	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'create a film' })
	@ApiBadRequestResponse({
		description: 'Bad Request or Internal Server Error',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'film created',
		type: FilmDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async createFilm(@Body() createFilmDto: CreateFilmDto): Promise<FilmsDetail> {
		const { genres, releaseDate } = createFilmDto;
		if (releaseDate) {
			createFilmDto.releaseDate = new Date(releaseDate);
		}

		const genresResources = new VerifyResource(this.genresService);
		const allGenresVerified: boolean = genresResources.verifyResource(genres);

		// TODO: do we want to add existing reviews or create review when film is created??
		// const reviewsResources = new VerifyResource(this.reviewsService);
		// const allReviewsVerified = reviewsResources.verifyResource(reviews);

		if (!allGenresVerified) {
			throw new HttpException(
				'one/more of the attached resource(s) does not exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		return await this.filmsService.createFilm(createFilmDto);
	}

	@UseGuards(JwtGuard)
	@Post('/addResources')
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@ApiBearerAuth('jwt')
	@ApiOperation({
		summary: 'add existing genre or new reviews to exisitng film',
	})
	@ApiBadRequestResponse({
		description: 'Bad request',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'film after resource addition',
		type: FilmDetailsResponse,
	})
	@ApiForbiddenResponse({
		description: 'permission to write review is denied',
		type: PermissionDeniedResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async addResourcesToFilm(
		@Body() addExistingResourcesToFilm: AddExistingResourcesToFilm,
	): Promise<FilmsDetail> {
		const { genres, review, filmId } = addExistingResourcesToFilm;
		// very the list of genre is objectId or not
		const genresResources = new VerifyResource(this.genresService);
		const allGenresVerified = genresResources.verifyResource(genres);

		// check if a user is reviewer
		if (review && Object.keys(review).length) {
			const user = (await this.usersService.getUserById(
				review.reviewerId,
			)) as UserDocument;

			if (!user || !user.isReviewer) {
				throw new HttpException(
					'permission to write review is denied',
					HttpStatus.FORBIDDEN,
				);
			}
			review.filmId = filmId;
		}
		if (!review.filmId || !review.reviewerId || !review.rating) {
			throw new HttpException(
				`the review object does not comply with its type`,
				HttpStatus.BAD_REQUEST,
			);
		}

		if (allGenresVerified) {
			return await this.filmsService.addResourcesToFilm({
				...addExistingResourcesToFilm,
				// override the reviews
				review,
			});
		}
	}

	@UseGuards(JwtGuard)
	@Patch(':filmId')
	@ApiBearerAuth('jwt')
	@ApiOperation({
		summary:
			'update name, description, release_date, photo and/or country of a film',
	})
	@ApiOkResponse({
		description: 'Film updated',
		type: FilmDetailsResponse,
	})
	@ApiBadRequestResponse({
		description: 'the film does not exists',
		type: ResourceNotFoundResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async updateFilm(
		@Param('filmId') filmId: string,
		@Body() updateFilmDto: UpdateFilmDto,
	): Promise<Film> {
		return await this.filmsService.updateFilm(filmId, updateFilmDto);
	}
}
