import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(_id: string): Promise<User> {
    return await this.usersRepository.findOne({ _id });
  }

  async userExists(emailId: string): Promise<Boolean> {
    const user = await this.usersRepository.findOne({ email: emailId });
    if (!user) return false;
    return true;
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    description: string,
    isReviewer: boolean,
  ): Promise<User> {
    return this.usersRepository.create({
      email,
      firstName,
      lastName,
      password,
      description,
      isReviewer
    });
  }

  async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
    return this.usersRepository.findOneAndUpdate({id: userId}, userUpdates);
  }
}
