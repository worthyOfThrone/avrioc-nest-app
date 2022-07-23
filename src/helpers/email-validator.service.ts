import { Injectable } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'isEmailUserAlreadyExist', async: true })
@Injectable()
export class IsEmailUserAlreadyExistConstraint
	implements ValidatorConstraintInterface
{
	constructor(private readonly usersService: UsersService) {}

	async validate(text: string) {
		return !(await this.usersService.userExists(text));
	}

	defaultMessage(args: ValidationArguments) {
		return `User already exist`;
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
