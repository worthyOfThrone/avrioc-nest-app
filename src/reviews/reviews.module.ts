import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsFilmExistConstraint } from 'src/helpers/is-film-exists-validator.service';
import { IsUserAValidReviewerConstraint } from 'src/helpers/is-reviewer-validator.service';
import { FilmsModule } from 'src/films/films.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
	imports: [
		forwardRef(() => FilmsModule),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		UsersModule
	],
	controllers: [ReviewsController],
	providers: [ReviewsService, ReviewsRepository, IsUserAValidReviewerConstraint, IsFilmExistConstraint],
	exports: [ReviewsService]
})
export class ReviewsModule {}
