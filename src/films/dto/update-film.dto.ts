import { ArrayMinSize, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator"
import { Genre } from "src/genres/schemas/genre.schema";
import { Review } from "src/reviews/schemas/review.schema";

export class UpdateFilmDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDate()
    releaseDate: Date;
 
    @IsString()
    country: string;
 
    @IsString()
    photo?: string; // url
}