import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from './user-details.interface';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	_getUserDetails(user: UserDocument): UserDetails {
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

	async getUserById(_id: string): Promise<UserDetails> {
		const user = await this.usersRepository.findOne({ _id });
		return this._getUserDetails(user);
	}

	async getUserByEmail(email: string): Promise<UserDocument> {
		return await this.usersRepository.findOne({ email });
	}

	async userExists(emailId: string): Promise<Boolean> {
		const user = await this.getUserByEmail(emailId);
		if (!user) return false;
		return true;
	}

	async getUsers(): Promise<UserDetails[]> {
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
		return await this.usersRepository.findOneAndUpdate({ id: userId }, userUpdates);
	}
}
