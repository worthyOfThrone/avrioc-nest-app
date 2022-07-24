import { Injectable } from '@nestjs/common';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenresRepository } from './genres.repository';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepository: GenresRepository) {}

  async getGenreById(genreId: string): Promise<Genre> {
    return this.genresRepository.findOne({ _id: genreId });
  }

  async resourceExistById(genre: GenreDocument): Promise<Genre> {
    return this.genresRepository.findOne({ _id: genre._id });
  }

  async getGenrebyName(name: string): Promise<Genre> | null {
    return await this.genresRepository.findOne({ name });
  }

  async getGenres(): Promise<Genre[]> {
    return this.genresRepository.find({});
  }

  async createGenre(
    name: string,
    description: string,
  ): Promise<Genre> {
    return this.genresRepository.create({
      name,
      description
    });
  }

  async updateGenre(genreId: string, genreUpdates: UpdateGenreDto): Promise<Genre> {
    return this.genresRepository.findOneAndUpdate({id: genreId}, genreUpdates);
  }
}
