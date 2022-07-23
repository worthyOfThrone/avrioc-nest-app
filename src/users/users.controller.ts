import { Body, Controller, Get, HttpCode, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new HttpException('User does not exist', 404);

    return user;
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.password,
      createUserDto.description,
      createUserDto.isReviewer,
    );
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
