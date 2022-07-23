import { IsBoolean, IsOptional, IsString, Length } from "class-validator"

export class UpdateUserDto {
    @Length(3, 255)
    firstName: string

    @Length(3, 255)
    lastName: string

    @Length(6)
    password: string

    @Length(3)
    description: string

    @IsOptional()
    @IsBoolean()
    isReviewer: boolean
}