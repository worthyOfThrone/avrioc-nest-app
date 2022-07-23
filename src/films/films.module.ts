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

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Film.name, schema: FilmsSchema }]),
		GenresModule,
		ReviewsModule,
		UsersModule
	],
	controllers: [FilmsController],
	providers: [FilmsService, FilmsRepository, IsFilmExistConstraint],
	exports: [FilmsService]
})
export class FilmsModule {}
