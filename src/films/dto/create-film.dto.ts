import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator"
import mongoose, { isValidObjectId } from "mongoose"
import { Genre } from "src/genres/schemas/genre.schema"
import { Review } from "src/reviews/schemas/review.schema"

export class CreateFilmDto {
    @IsNotEmpty({ message: 'name is required'})
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'description is required'})
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'releaseDate is required'})
    @IsString()
    releaseDate: Date;
 
    @IsNotEmpty({ message: 'country is required'})
    @IsString()
    country: string;
 
    @IsMongoId({each: true, message: 'please provide valid reviews id'})
    @ArrayMinSize(0)
    reviews?: Review[];
 
    @IsMongoId({each: true, message: 'please provide valid genre id'})
    @ArrayMinSize(0)
    genres?: Genre[];
 
    @IsOptional()
    @IsString()
    photo?: string; // url
}