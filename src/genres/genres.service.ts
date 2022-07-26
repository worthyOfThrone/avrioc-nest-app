import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenresDetail } from './dto/interfaces/genre-interface.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresRepository } from './genres.repository';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresService {
	constructor(private readonly genresRepository: GenresRepository) {}

	_getGenreDetails(genre: GenreDocument): GenresDetail {
		return {
			id: genre._id,
			name: genre.name,
			description: genre.description,
			createdAt: genre.createdAt,
			updatedAt: genre.updatedAt,
		};
	}

	async getGenreById(genreId: string): Promise<GenreDocument> {
		return await this.genresRepository.findOne({ _id: genreId });
	}

	async resourceExistById(genre: GenreDocument): Promise<Genre> {
		return await this.genresRepository.findOne({ _id: genre._id });
	}

	async getGenrebyName(name: string): Promise<GenreDocument> {
		return await this.genresRepository.findOne({ name });
	}

	async getGenres(): Promise<GenresDetail[]> {
		const genres = await this.genresRepository.find({});
		return genres.map((genre) => {
			return this._getGenreDetails(genre);
		});
	}

	async createGenre(name: string, description: string): Promise<GenresDetail> {
		const genreToCreate = await this.getGenrebyName(name);
		if (genreToCreate)
			throw new HttpException(
				`the resource with name ${name} already exists`,
				HttpStatus.FORBIDDEN,
			);
		const genre = await this.genresRepository.create({
			name,
			description,
		});
		return this._getGenreDetails(genre);
	}

	async updateGenre(
		genreId: string,
		genreUpdates: UpdateGenreDto,
	): Promise<GenresDetail> {
		const genre = await this.getGenreById(genreId);
		if (!genre)
			throw new HttpException(
				`the resource with id ${genreId} does not exists`,
				HttpStatus.BAD_REQUEST,
			);

		if (genreUpdates.name !== genre.name) {
			const genreToCreate = await this.getGenreById(genreId);
			if (genreToCreate)
				throw new HttpException(
					`the resource with name ${genreUpdates.name} already exists`,
					HttpStatus.FORBIDDEN,
				);
		}

		const updatedgenre = await this.genresRepository.findOneAndUpdate(
			{ _id: genreId },
			genreUpdates,
		);

		return this._getGenreDetails(updatedgenre);
	}
}
