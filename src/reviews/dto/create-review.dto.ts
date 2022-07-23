import { IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"
import { IsFilmExists } from "src/helpers/is-film-exists-validator.service"
import { IsUserAValidReviewer } from "src/helpers/is-reviewer-validator.service"

export class CreateReviewDto {
    @IsNotEmpty({ message: 'rating is required'})
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number

    @IsMongoId()
    @IsFilmExists()
    filmId: string

    @IsMongoId()
    @IsUserAValidReviewer()
    reviewerId: string

    comment?: string
}