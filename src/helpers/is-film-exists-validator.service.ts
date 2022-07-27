import { Injectable, Logger } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { FilmsService } from 'src/films/films.service';
import { loggerMessages } from 'src/lib/logger';

@ValidatorConstraint({ name: 'isFilmExists', async: true })
@Injectable()
export class IsFilmExistConstraint
	implements ValidatorConstraintInterface
{
	private readonly logger = new Logger('IsFilmExistConstraint');

	constructor(private readonly filmsService: FilmsService) {}

	async validate(id: string) {
		return !!(await this.filmsService.getFilmById(id));
	}

	defaultMessage(args: ValidationArguments) {
		this.logger.log(
			`[IsFilmExistConstraint]: ${loggerMessages.NOT_FOUND} ${JSON.stringify(args.value)}`,
		);
		return `The film with id ${args.value} does not exists`;
    }
}

export function IsFilmExists(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'isFilmExists',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsFilmExistConstraint,
		});
	};
}
