import { IsNotEmpty, IsString, Length } from "class-validator"

export class CreateGenreDto {
    @IsNotEmpty({ message: 'name is required'})
    @IsString()
    @Length(3, 255)
    name: string

    @IsString()
    description: string
}