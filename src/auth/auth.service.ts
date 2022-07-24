import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ExistingUserDto } from 'src/users/dto/args/existing-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserDetails } from 'src/users/user-details.interface';

import { UsersService } from 'src/users/users.service';
import { JwtTokenType } from './jwt-token.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}

	async register(user: Readonly<CreateUserDto>): Promise<UserDetails | null> {
		const { description, email, firstName, isReviewer, lastName } = user;
		const isUserExists = await this.usersService.userExists(email);

		if (isUserExists) throw new HttpException('User already exists', 500);

		const hashedPassword = await this.hashPassword(user.password);

		const newUser = await this.usersService.createUser(
			email,
			firstName,
			lastName,
			hashedPassword,
			description,
			isReviewer,
		);
		return this.usersService._getUserDetails(newUser);
	}

	async doesPasswordMatch(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}

	async validateuser(
		email: string,
		password: string,
	): Promise<UserDetails | null> {
		const user = await this.usersService.getUserByEmail(email);
		const doesUserExists = !!user;

		if (!doesUserExists) return null;
		const doesPassowrdMatch = await this.doesPasswordMatch(password, user.password);

		if (!doesPassowrdMatch) return null;

		return this.usersService._getUserDetails(user);
	}

	async login(existingUser: ExistingUserDto): Promise<JwtTokenType> {
		const { email, password } = existingUser;
		const user = await this.validateuser(email, password);

		if (!user) throw new HttpException('email or password does not match', HttpStatus.BAD_REQUEST);

		const jwtToken = await this.jwtService.signAsync({ user });
		return { jwtToken };
	}
}
