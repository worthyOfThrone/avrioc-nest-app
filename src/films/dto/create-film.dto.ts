import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

import { Genre } from 'src/genres/schemas/genre.schema';

import { FilmsDetail } from './interfaces/film-interface.dto';

export class CreateFilmDto {
	@IsNotEmpty({ message: 'name is required' })
	@IsString()
	name: string;

	@IsNotEmpty({ message: 'description is required' })
	@IsString()
	description: string;

	@IsNotEmpty({ message: 'releaseDate is required' })
	@IsString()
	releaseDate: Date;

	@IsNotEmpty({ message: 'country is required' })
	@IsString()
	country: string;

	@IsMongoId({ each: true, message: 'please provide valid genre id' })
	@ArrayMinSize(0)
	genres?: Genre[];

	@IsOptional()
	@IsString()
	photo?: string; // url
}

export class FilmDetailsResponse extends FilmsDetail {}
export class AllFilmDetailsResponse {
	films: FilmsDetail[];
}
