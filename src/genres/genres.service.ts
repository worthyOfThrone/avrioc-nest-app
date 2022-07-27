import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { loggerMessages } from 'src/lib/logger';
import { GenresDetail } from './dto/interfaces/genre-interface.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresRepository } from './genres.repository';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresService {
	private readonly logger = new Logger(GenresService.name);

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
		const genre = await this.genresRepository.findOne({ _id: genreId });
		this.logger.log(
			`[getGenreById]: ${
				genre ? loggerMessages.FOUND : loggerMessages.NOT_FOUND
			} ${JSON.stringify(genre || genreId)}`,
		);
		return genre;
	}

	async resourceExistById(genre: GenreDocument): Promise<Genre> {
		const resource = await this.genresRepository.findOne({ _id: genre._id });
		const logMessage = resource
			? loggerMessages.FOUND + JSON.stringify(resource)
			: `${loggerMessages.NOT_FOUND} ${genre}`;

		this.logger.log(`[resourceExistById]: ${logMessage}`);

		return resource;
	}

	async getGenrebyName(name: string): Promise<GenreDocument> {
		const genre = await this.genresRepository.findOne({ name });
		const logMessage = genre
			? loggerMessages.FOUND + JSON.stringify(genre)
			: `${loggerMessages.NOT_FOUND} ${name}`;

		this.logger.log(`[resourceExistById]: ${logMessage}`);

		return genre;
	}

	async getGenres(): Promise<GenresDetail[]> {
		const genres = await this.genresRepository.find({});
		this.logger.log(
			`[getGenres]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(genres)}`,
		);
		return genres.map((genre) => {
			return this._getGenreDetails(genre);
		});
	}

	async createGenre(name: string, description: string): Promise<GenresDetail> {
		const genreToCreate = await this.getGenrebyName(name);
		if (genreToCreate) {
			this.logger.log(
				`[createGenre]: ${loggerMessages.ALREADY_EXISTS} ${name}`,
			);
			throw new HttpException(
				`the resource with name ${name} already exists`,
				HttpStatus.FORBIDDEN,
			);
		}
		const genre = await this.genresRepository.create({
			name,
			description,
		});
		this.logger.log(
			`[createGenre]: ${loggerMessages.CREATED} ${JSON.stringify(genre)}`,
		);
		return this._getGenreDetails(genre);
	}

	async updateGenre(
		genreId: string,
		genreUpdates: UpdateGenreDto,
	): Promise<GenresDetail> {
		const genre = await this.resourceExistById({
			_id: genreId,
		} as GenreDocument);
		if (!genre)
			// the message must already be logged in resourceExistById call, hence skip it
			throw new HttpException(
				`the resource with id ${genreId} does not exists`,
				HttpStatus.BAD_REQUEST,
			);

		if (genreUpdates.name !== genre.name) {
			this.logger.log(
				`[updateGenre]: ${loggerMessages.ALREADY_EXISTS} ${genreUpdates.name}`,
			);
			throw new HttpException(
				`the resource with name ${genreUpdates.name} already exists`,
				HttpStatus.FORBIDDEN,
			);
		}

		const updatedgenre = await this.genresRepository.findOneAndUpdate(
			{ _id: genreId },
			genreUpdates,
		);
		this.logger.log(
			`[updateGenre]: ${loggerMessages.UPDATED} ${JSON.stringify(
				updatedgenre,
			)}`,
		);

		return this._getGenreDetails(updatedgenre);
	}
}
