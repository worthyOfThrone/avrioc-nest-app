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

@ValidatorConstraint({ name: 'isUserAValidReviewer', async: true })
@Injectable()
export class IsUserAValidReviewerConstraint
	implements ValidatorConstraintInterface
{
	private readonly logger = new Logger('IsUserAValidReviewerConstraint');

	constructor(private readonly usersService: UsersService) {}

	async validate(id: string) {
		const user = await this.usersService.getUserById(id);
		return user && user.isReviewer;
	}

	defaultMessage(args: ValidationArguments) {
		this.logger.log(
			`[IsUserAValidReviewerConstraint]: ${loggerMessages.FORBIDDON} ${JSON.stringify(args.value)}`,
		);
		return `the user is not a valid reviewer`;
	  }
}

export function IsUserAValidReviewer(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'isUserAValidReviewer',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsUserAValidReviewerConstraint,
		});
	};
}
