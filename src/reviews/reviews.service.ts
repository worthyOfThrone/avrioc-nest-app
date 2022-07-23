import { HttpException, Injectable } from '@nestjs/common';
import { Film } from 'src/films/schemas/film.schema';
import { User } from 'src/users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
	constructor(
		private readonly reviewsRepository: ReviewsRepository
	) {}

	async getReviewById(_id: string): Promise<Review> {
		const review = await this.reviewsRepository.findOne({ _id });
		if (!review) throw new HttpException("the review doesn't exist", 404);

		return review.populate('reviewerId');
	}

	async resourceExistById(review: ReviewDocument): Promise<Review> {
		return await this.reviewsRepository.findOne({ _id: review._id });
	}

	async getReviewbyReviewerIdAndFilmId(reviewerId: Partial<User>, filmId: Partial<Film>): Promise<Review> | null {
		return await this.reviewsRepository.findOne({ reviewerId, filmId });
	}

	async getReviewsbyReviewerId(reviewerId: string): Promise<Review[]> | null {
		return await this.reviewsRepository.find({ reviewerId }, ['filmId', 'reviewerId']);
	}

	async getReviewsbyFilmId(filmId: string): Promise<Review[]> | null {
		return await this.reviewsRepository.find({ filmId }, ['filmId', 'reviewerId']);
	}
	async getReviews(): Promise<Review[]> {
		return await this.reviewsRepository.find({}, ['reviewerId']);
	}

	async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
		return await this.reviewsRepository.create(createReviewDto);
	}

	async updateReview(
		reviewId: string | Partial<ReviewDocument>,
		reviewUpdates: UpdateReviewDto,
	): Promise<Review> {
		return this.reviewsRepository.findOneAndUpdate(
			{ _id: reviewId },
			reviewUpdates,
		);
	}

	async createManyReviews(createReviewDtos: CreateReviewDto[]) {
		return this.reviewsRepository.insertMany(createReviewDtos);
	}
}
