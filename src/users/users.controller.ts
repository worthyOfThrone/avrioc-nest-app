import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserDetails } from './user-details.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserDetails> {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new HttpException(`the resource with ${userId} does not exist`, HttpStatus.NOT_FOUND);

    return user;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getUsers(): Promise<UserDetails[]> {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDetails> {
    const user = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.password,
      createUserDto.description,
      createUserDto.isReviewer,
    );
    return this.usersService._getUserDetails(user);
  }

  @UseGuards(JwtGuard)
  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDetails> {
    const user = await this.usersService.updateUser(userId, updateUserDto);
    return this.usersService._getUserDetails(user);
  }
}
