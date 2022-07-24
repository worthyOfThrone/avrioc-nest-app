import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ExistingUserDto {
	@IsNotEmpty({ message: 'password is required' })
	@Length(6)
	password: string;

	@IsNotEmpty({ message: 'email is required' })
	@IsEmail()
	email: string;
}
