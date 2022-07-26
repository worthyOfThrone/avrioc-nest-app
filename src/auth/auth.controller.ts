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
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { ExistingUserDto } from 'src/users/dto/args/existing-user.dto';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersDetail } from 'src/users/dto/interfaces/user-details.dto';
import { AuthService } from './auth.service';
import {
	ResourceAlreadyExistsResponse,
	ResourceNotFoundResponse,
} from './dto/interfaces/auth-error-interface.dto';
import { JwtTokenType } from './dto/interfaces/jwt-token-interface.dto';

@ApiTags('Auth Module')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'User registration' })
	@ApiForbiddenResponse({
		description: 'User already exists',
		type: ResourceAlreadyExistsResponse,
	})
	@ApiOkResponse({
		description: 'User is registered',
		type: UsersDetail,
	})
	register(@Body() user: RegisterUserDto): Promise<UsersDetail> {
		return this.authService.register(user);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'User Login' })
	@ApiBadRequestResponse({
		description: 'Invalid credential',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'User log in',
		type: JwtTokenType,
	})
	login(@Body() user: ExistingUserDto): Promise<JwtTokenType> {
		return this.authService.login(user);
	}

	@Post('token')
	@HttpCode(HttpStatus.OK)
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'Jwt Token Generation Service' })
	@ApiBadRequestResponse({
		description: 'Invalid credential',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'Generate Jwt token',
		type: JwtTokenType,
	})
	getToken(@Body() user: ExistingUserDto): Promise<JwtTokenType> {
		return this.login(user);
	}
}
