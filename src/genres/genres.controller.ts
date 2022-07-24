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
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';
import { Genre } from './schemas/genre.schema';

@Controller('genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) {}

	@UseGuards(JwtGuard)
	@Get(':genreId')
	async getGenre(@Param('genreId') genreId: string): Promise<Genre> {
		const genre = await this.genresService.getGenreById(genreId);
		if (!genre) {
			throw new HttpException(
				`the resource with ${genreId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return genre;
	}

	@UseGuards(JwtGuard)
	@Get('name/:genreName')
	async getGenreByName(@Param('genreName') genreName: string): Promise<Genre> {
		const genre = await this.genresService.getGenrebyName(genreName);
		if (!genre) {
			throw new HttpException(
				`the resource with ${genreName} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return genre;
	}

	@UseGuards(JwtGuard)
	@Get()
	async getGenres(): Promise<Genre[]> {
		return this.genresService.getGenres();
	}

	@UseGuards(JwtGuard)
	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	async createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
		return this.genresService.createGenre(
			createGenreDto.name,
			createGenreDto.description,
		);
	}

	@UseGuards(JwtGuard)
	@Patch(':genreId')
	async updateGenre(
		@Param('genreId') genreId: string,
		@Body() updateGenreDto: UpdateGenreDto,
	): Promise<Genre> {
		return this.genresService.updateGenre(genreId, updateGenreDto);
	}
}
