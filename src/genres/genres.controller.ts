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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';
import { Genre } from './schemas/genre.schema';

@Controller('genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) {}

	@Get(':genreId')
	async getGenre(@Param('genreId') genreId: string): Promise<Genre> {

		const genre = await this.genresService.getGenreById(genreId);
    	if (!genre) throw new HttpException('Genre does not exisit', 404);
		return genre;
	}

	@Get(':name')
	async getGenreByName(@Param('genreName') genreName: string): Promise<Genre> {
		const genre = await this.genresService.getGenrebyName(genreName);
		if (!genre) {
			throw new HttpException('Genre does not exists', 404);
		}
    return genre
	}

	@Get()
	async getGenres(): Promise<Genre[]> {
		return this.genresService.getGenres();
	}

	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	async createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
		return this.genresService.createGenre(
			createGenreDto.name,
			createGenreDto.description
		);
	}

	@Patch(':genreId')
	async updateGenre(
		@Param('genreId') genreId: string,
		@Body() updateGenreDto: UpdateGenreDto,
	): Promise<Genre> {
		return this.genresService.updateGenre(genreId, updateGenreDto);
	}
}
