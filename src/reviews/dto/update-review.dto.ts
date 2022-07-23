import { IsNotEmpty, IsString, Max, Min } from "class-validator"

export class UpdateReviewDto {
    @IsNotEmpty({ message: 'rating is required'})
    @IsString()
    @Min(1)
    @Max(5)
    rating: number

    comment?: string
}