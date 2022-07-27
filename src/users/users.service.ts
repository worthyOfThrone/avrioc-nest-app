import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDetail } from './dto/interfaces/user-details.dto';
import { loggerMessages } from 'src/lib/logger';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

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
			updatedAt: user.updatedAt,
		};
	}

	async getUserById(_id: string): Promise<UsersDetail> {
		const user = await this.usersRepository.findOne({ _id });
		const logMessage = user
			? loggerMessages.GENERIC + JSON.stringify(this._getUserDetails(user))
			: `${loggerMessages.NOT_FOUND} ${_id}`;
		this.logger.log(`[getUserById]: ${logMessage}`);
		return this._getUserDetails(user);
	}

	async getUserByEmailOrId(field: string): Promise<UserDocument> {
		const user = await this.usersRepository.findOne({ field });
		const logMessage = user
			? loggerMessages.GENERIC + JSON.stringify(this._getUserDetails(user))
			: `${loggerMessages.NOT_FOUND} ${field}`;

		this.logger.log(`[getUserByEmailOrId]: ${logMessage}`);
		return user;
	}

	async userExists(field: string): Promise<Boolean> {
		const user = await this.getUserByEmailOrId(field);
		if (!user) {
			this.logger.log(`[userExists]: ${loggerMessages.NOT_FOUND} ${field}`);
			return false;
		}
		this.logger.log(
			`[userExists]: ${loggerMessages.FOUND} ${JSON.stringify(user)}`,
		);
		return true;
	}

	async getUsers(): Promise<UsersDetail[]> {
		const users = (await this.usersRepository.find({})).map((user) =>
			this._getUserDetails(user),
		);
		this.logger.log(
			`[getUsers]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(users)}`,
		);
		return users;
	}

	async createUser(
		email: string,
		firstName: string,
		lastName: string,
		password: string,
		description: string,
		isReviewer: boolean,
	): Promise<UserDocument> {
		const user = await this.usersRepository.create({
			email,
			firstName,
			lastName,
			password,
			description,
			isReviewer,
		});
		this.logger.log(
			`[createUser]: ${loggerMessages.CREATED} ${JSON.stringify(user)}`,
		);
		return user;
	}

	async updateUser(
		userId: string,
		userUpdates: UpdateUserDto,
	): Promise<UserDocument> {
		const user = await this.userExists(userId);
		if (!user) {
			this.logger.log(
				`[updateUser]: ${loggerMessages.NOT_FOUND} ${JSON.stringify(userId)}`,
			);
			throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
		}
		const updatedUser = await this.usersRepository.findOneAndUpdate(
			{ _id: userId },
			userUpdates,
		);
		this.logger.log(
			`[updateUser]: ${loggerMessages.UPDATED} ${JSON.stringify(updatedUser)}`,
		);
		return updatedUser;
	}
}
