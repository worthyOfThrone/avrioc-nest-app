import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExistingUserDto } from 'src/users/dto/args/existing-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDetails } from 'src/users/user-details.interface';
import { AuthService } from './auth.service';
import { JwtTokenType } from './jwt-token.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOkResponse({
		description: 'User registration',
	})
	@ApiBadRequestResponse({
		description: 'User already exists',
	})
	register(@Body() user: CreateUserDto): Promise<UserDetails | null> {
		return this.authService.register(user);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOkResponse({
		description: 'User logg-in',
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid credential',
	})
	@ApiBadRequestResponse({
		description: 'Invalid credential',
	})
	login(@Body() user: ExistingUserDto): Promise<JwtTokenType> {
		return this.authService.login(user);
	}

	@Post('token')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOkResponse({
		description: 'Generate Jwt token',
	})
	getToken(@Body() user: ExistingUserDto): Promise<JwtTokenType> {
		return this.login(user);
	}
}
