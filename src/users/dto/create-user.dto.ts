import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
} from 'class-validator';
import { IsEmailUserAlreadyExist } from 'src/helpers/email-validator.service';
import { UsersDetail } from './interfaces/user-details.dto';

export class LoginDTO {
	/**
	 * email id
	 * @example abc@gmail.com
	 */
	@IsNotEmpty({ message: 'email is required' })
	@IsEmail()
	@IsString()
	@IsEmailUserAlreadyExist()
	email: string;

	@IsNotEmpty({ message: 'password is required' })
	@IsString()
	@Length(6)
	password: string;
}

export class LoginBody {
	// @ApiProperty()
	user: LoginDTO;
}

export class RegisterUserDto extends LoginDTO {
	@IsNotEmpty({ message: 'firstname is required' })
	@Length(3, 255)
	firstName: string;

	@IsNotEmpty({ message: 'lastName is required' })
	@Length(3, 255)
	lastName: string;

	@IsNotEmpty({ message: 'description is required' })
	@Length(3)
	description: string;

	@IsNotEmpty({ message: 'is user a reviewer' })
	@IsBoolean()
	isReviewer: boolean;
}

export class RegisterBody {
	@ApiProperty()
	user: RegisterUserDto;
}


export class UserDetailsResponse extends UsersDetail {}
export class AllUserDetailsResponse {
	users: UsersDetail[];
}
