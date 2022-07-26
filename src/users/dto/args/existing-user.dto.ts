import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ExistingUserDto {
	@IsNotEmpty({ message: 'password is required' })
	@Length(6)
	// @ApiProperty({
	// 	type: String,
	// 	description: 'password',
	// })
	password: string;

	@IsNotEmpty({ message: 'email is required' })
	@IsEmail()
	// @ApiProperty({
	// 	type: String,
	// 	description: 'email',
	// })
	email: string;
}
