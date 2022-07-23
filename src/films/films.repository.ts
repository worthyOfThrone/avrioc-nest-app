import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Film, FilmsDocument } from './schemas/film.schema';

@Injectable()
export class FilmsRepository extends EntityRepository<FilmsDocument> {
	constructor(@InjectModel(Film.name) filmsModel: Model<FilmsDocument>) {
		super(filmsModel);
	}
}
