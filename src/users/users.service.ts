import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDetail } from './dto/interfaces/user-details.dto';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	_getUserDetails(user: UserDocument): UsersDetail {
		if (!user) return;
		return {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			description: user.description,
			isReviewer: user.isReviewer,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		};
	}

	async getUserById(_id: string): Promise<UsersDetail> {
		const user = await this.usersRepository.findOne({ _id });
		return this._getUserDetails(user);
	}

	async getUserByEmailOrId(field: string): Promise<UserDocument> {
		return await this.usersRepository.findOne({ field });
	}

	async userExists(field: string): Promise<Boolean> {
		const user = await this.getUserByEmailOrId(field);
		if (!user) return false;
		return true;
	}

	async getUsers(): Promise<UsersDetail[]> {
		return (await this.usersRepository.find({})).map(user => this._getUserDetails(user));
	}

	async createUser(
		email: string,
		firstName: string,
		lastName: string,
		password: string,
		description: string,
		isReviewer: boolean,
	): Promise<UserDocument> {
		return await this.usersRepository.create({
			email,
			firstName,
			lastName,
			password,
			description,
			isReviewer,
		});
	}

	async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<UserDocument> {
		const user = await this.userExists(userId);
		if (!user) throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST)
		return await this.usersRepository.findOneAndUpdate({ _id: userId }, userUpdates);
	}
}
