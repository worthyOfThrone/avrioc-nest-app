import { IsNotEmpty, IsString, Length } from "class-validator"

export class UpdateGenreDto {
    @IsNotEmpty({message: 'name is required'})
    @IsString()
    @Length(3, 255)
    name: string

    @IsNotEmpty({message: 'description is required'})
    @IsString()
    description: string
}