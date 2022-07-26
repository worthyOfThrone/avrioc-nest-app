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
import {
	AllGenreDetailsResponse,
	CreateGenreDto,
	GenreDetailsResponse,
} from './dto/create-genre.dto';
import { GenresDetail } from './dto/interfaces/genre-interface.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';

@ApiTags('Genre Module')
@Controller('genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) {}

	@UseGuards(JwtGuard)
	@Get(':genreId')
	@ApiOperation({ summary: 'get genre by id' })
	@ApiBearerAuth('jwt')
	@ApiNotFoundResponse({
		description: 'genre does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'film detail of respective id',
		type: GenreDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getGenre(@Param('genreId') genreId: string): Promise<GenresDetail> {
		const genre = await this.genresService.getGenreById(genreId);
		if (!genre) {
			throw new HttpException(
				`the resource with ${genreId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return this.genresService._getGenreDetails(genre);
	}

	@UseGuards(JwtGuard)
	@Get('name/:genreName')
	@ApiOperation({ summary: "get genre by it's name" })
	@ApiBearerAuth('jwt')
	@ApiNotFoundResponse({
		description: 'genre does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'genre detail of respective name',
		type: GenreDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getGenreByName(
		@Param('genreName') genreName: string,
	): Promise<GenresDetail> {
		const genre = await this.genresService.getGenrebyName(genreName);
		if (!genre) {
			throw new HttpException(
				`the resource with ${genreName} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return this.genresService._getGenreDetails(genre);
	}

	@UseGuards(JwtGuard)
	@Get()
	@ApiOperation({ summary: 'get all genres' })
	@ApiBearerAuth('jwt')
	@ApiOkResponse({
		description: 'genre details array',
		type: AllGenreDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getGenres(): Promise<{
		genres: GenresDetail[];
	}> {
		const genres = await this.genresService.getGenres();
		return { genres };
	}

	@UseGuards(JwtGuard)
	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'create a genre' })
	@ApiBearerAuth('jwt')
	@ApiBadRequestResponse({
		description: 'the genre with name already exists',
		type: PermissionDeniedResponse,
	})
	@ApiOkResponse({
		description: 'film created',
		type: GenreDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async createGenre(
		@Body() createGenreDto: CreateGenreDto,
	): Promise<GenresDetail> {
		return this.genresService.createGenre(
			createGenreDto.name,
			createGenreDto.description,
		);
	}

	@UseGuards(JwtGuard)
	@Patch(':genreId')
	@ApiOperation({ summary: 'update a genre' })
	@ApiBearerAuth('jwt')
	@ApiBadRequestResponse({
		description: 'the genre does not exists',
		type: ResourceNotFoundResponse,
	})
	@ApiForbiddenResponse({
		description: 'the genre with this name already exists',
		type: PermissionDeniedResponse,
	})
	@ApiOkResponse({
		description: 'Genre updated',
		type: GenreDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async updateGenre(
		@Param('genreId') genreId: string,
		@Body() updateGenreDto: UpdateGenreDto,
	): Promise<GenresDetail> {
		return this.genresService.updateGenre(genreId, updateGenreDto);
	}
}
