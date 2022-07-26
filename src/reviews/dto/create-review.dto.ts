import {
	IsInt,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
} from 'class-validator';
import { IsFilmExists } from 'src/helpers/is-film-exists-validator.service';
import { IsUserAValidReviewer } from 'src/helpers/is-reviewer-validator.service';
import { ReviewsDetail } from './interfaces/review-interface.dto';

export class CreateReviewDto {
	@IsNotEmpty({ message: 'rating is required' })
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number;

	@IsMongoId()
	@IsFilmExists()
	filmId: string;

	@IsNotEmpty({ message: 'reviewer id is required' })
	@IsMongoId()
	@IsUserAValidReviewer()
	reviewerId: string;

	comment?: string;
}

export class ReviewDetailsResponse extends ReviewsDetail {}

export class AllReviewsDetailResponse {
	reviews: ReviewsDetail[];
}
