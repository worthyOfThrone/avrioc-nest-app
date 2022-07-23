import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresRepository extends EntityRepository<GenreDocument> {
	constructor(@InjectModel(Genre.name) genreModel: Model<GenreDocument>) {
		super(genreModel);
	}
}
