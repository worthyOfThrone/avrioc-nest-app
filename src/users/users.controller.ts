import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	InternalServerError,
	ResourceAlreadyExistsResponse,
	ResourceNotFoundResponse,
	UnAuthorizedResponse,
} from 'src/auth/dto/interfaces/auth-error-interface.dto';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import {
	AllUserDetailsResponse,
	RegisterUserDto,
	UserDetailsResponse,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDetail } from './dto/interfaces/user-details.dto';
import { UsersService } from './users.service';

@ApiTags('User Module')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtGuard)
	@Get(':userId')
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'get user by id' })
	@ApiNotFoundResponse({
		description: 'User does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'users detail',
		type: UserDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getUser(@Param('userId') userId: string): Promise<UsersDetail> {
		const user = await this.usersService.getUserById(userId);
		if (!user)
			throw new HttpException(
				`the resource with ${userId} does not exist`,
				HttpStatus.NOT_FOUND,
			);

		return user;
	}

	@UseGuards(JwtGuard)
	@Get()
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'get all users' })
	@ApiOkResponse({
		description: 'get all users',
		type: AllUserDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getUsers(): Promise<{ users: UsersDetail[] }> {
		const users = await this.usersService.getUsers();
		return {
			users
		};
	}


	@UseGuards(JwtGuard)
	@Patch(':userId')
	@ApiBearerAuth('jwt')
	@ApiOperation({ summary: 'update user details' })
	@ApiBadRequestResponse({
		description: 'User does not exist',
		type: InternalServerError,
	})
	@ApiOkResponse({
		description: 'User update',
		type: UsersDetail,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async updateUser(
		@Param('userId') userId: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UsersDetail> {
		const user = await this.usersService.updateUser(userId, updateUserDto);
		return this.usersService._getUserDetails(user);
	}
}
