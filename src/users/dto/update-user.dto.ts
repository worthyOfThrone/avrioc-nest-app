import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString, Length } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @Length(3, 255)
    // @ApiProperty({
    //     type: String,
    //     description: 'firstName'
    // })
    firstName: string

    @IsOptional()
    @Length(3, 255) 
    // @ApiProperty({
    //     type: String,
    //     description: 'lastName'
    // })
    lastName: string

    @IsOptional()
    @Length(6)
    // @ApiProperty({
    //     type: String,
    //     description: 'password'
    // })
    password: string

    @IsOptional()
    @Length(3)
    // @ApiProperty({
    //     type: String,
    //     description: 'description'
    // })
    description: string

    @IsOptional()
    @IsBoolean()
    // @ApiProperty({
    //     type: String,
    //     description: 'isReviewer'
    // })
    isReviewer: boolean
}

export class UpdateUserBody {
    // @ApiProperty()
	user: UpdateUserDto;
}