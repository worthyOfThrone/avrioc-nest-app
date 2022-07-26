import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsFilmExistConstraint } from 'src/helpers/is-film-exists-validator.service';
import { GenresModule } from 'src/genres/genres.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { FilmsController } from './films.controller';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';
import { Film, FilmsSchema } from './schemas/film.schema';
import { IsUserAValidReviewerConstraint } from 'src/helpers/is-reviewer-validator.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Film.name, schema: FilmsSchema }]),
		GenresModule,
		ReviewsModule,
		UsersModule,
	],
	controllers: [FilmsController],
	providers: [
		FilmsService,
		FilmsRepository,
		IsFilmExistConstraint,
		IsUserAValidReviewerConstraint,
	],
	exports: [FilmsService],
})
export class FilmsModule {}
