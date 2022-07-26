import { IsNotEmpty, IsString, Length } from "class-validator"
import { GenresDetail } from "./interfaces/genre-interface.dto"

export class CreateGenreDto {
    @IsNotEmpty({ message: 'name is required'})
    @IsString()
    @Length(3, 255)
    name: string

    @IsString()
    description: string
}

export class GenreDetailsResponse extends GenresDetail {}

export class AllGenreDetailsResponse {
    genres: GenresDetail[];
}