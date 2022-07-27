import { Injectable, Logger } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { loggerMessages } from 'src/lib/logger';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'isEmailUserAlreadyExist', async: true })
@Injectable()
export class IsEmailUserAlreadyExistConstraint
	implements ValidatorConstraintInterface
{
	private readonly logger = new Logger('IsEmailUserAlreadyExistConstraint');

	constructor(private readonly usersService: UsersService) {}

	async validate(text: string) {
		return !(await this.usersService.userExists(text));
	}

	defaultMessage(args: ValidationArguments) {
		this.logger.log(
			`[IsEmailUserAlreadyExistConstraint]: ${loggerMessages.ALREADY_EXISTS} ${JSON.stringify(args.value)}`,
		);
		return  `The user with id ${args.value} already exists`;
	  }
}

export function IsEmailUserAlreadyExist(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'isEmailUserAlreadyExist',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsEmailUserAlreadyExistConstraint,
		});
	};
}
