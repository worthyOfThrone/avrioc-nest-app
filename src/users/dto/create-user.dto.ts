import { IsBoolean, isBoolean, IsEmail, IsNotEmpty, Length } from "class-validator"
import { IsEmailUserAlreadyExist } from "src/helpers/email-validator.service"

export class CreateUserDto {
    @IsNotEmpty({ message: 'firstname is required'})
    @Length(3, 255)
    firstName: string

    @IsNotEmpty({ message: 'lastName is required'})
    @Length(3, 255)
    lastName: string

    @IsNotEmpty({ message: 'password is required'})
    @Length(6)
    password: string

    @IsNotEmpty({ message: 'email is required'})
    @IsEmail()
    @IsEmailUserAlreadyExist()
    email: string

    @IsNotEmpty({ message: 'description is required'})
    @Length(3)
    description: string

    @IsNotEmpty({ message: 'is user a reviewer'})
    @IsBoolean()
    isReviewer: boolean

}