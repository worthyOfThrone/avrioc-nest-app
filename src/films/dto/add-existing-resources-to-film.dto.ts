import { ArrayMinSize, IsMongoId, IsNotEmpty, IsObject, IsOptional } from "class-validator"
import { IsFilmExists } from "src/helpers/is-film-exists-validator.service";
import { Genre } from "src/genres/schemas/genre.schema"
import { CreateReviewDto } from "src/reviews/dto/create-review.dto";


export class AddExistingResourcesToFilm { 
    @IsNotEmpty()
    @IsMongoId({message: 'please provide valid film id'})
    @IsFilmExists()
    filmId: string;

    @IsOptional()
    @IsMongoId({each: true, message: 'please provide valid genre id'})
    @ArrayMinSize(1)
    genres?: Genre[];

    @IsOptional()
    @IsObject()
    review?: CreateReviewDto;
}