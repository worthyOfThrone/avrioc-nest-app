import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Film, FilmsDocument } from 'src/films/schemas/film.schema';
import { User } from 'src/users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import {
	fieldsToPopulateReviewArray,
	fieldsToPopulateReviewObject,
	ReviewsDetail,
} from './dto/interfaces/review-interface.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
	constructor(private readonly reviewsRepository: ReviewsRepository) {}

	_getReviewDetails(review: ReviewDocument): ReviewsDetail {
		return {
			id: review._id,
			rating: review.rating,
			comment: review.comment,
			filmId: review.filmId,
			reviewerId: review.reviewerId,
			createdAt: review.createdAt,
			updatedAt: review.updatedAt,
		};
	}

	async getReviewById(_id: string): Promise<ReviewsDetail> | null {
		const review = await this.reviewsRepository.findOne({ _id });
		if (review)
			return this._getReviewDetails(
				await review.populate(fieldsToPopulateReviewArray),
			);
		throw new HttpException(
			`the resource with id ${_id} does not exists`,
			HttpStatus.NOT_FOUND,
		);
	}

	async resourceExistById(review: ReviewDocument): Promise<Review> {
		return await this.reviewsRepository.findOne({ _id: review._id });
	}

	async getReviewbyReviewerIdAndFilmId(
		reviewerId: Partial<User>,
		filmId: Partial<Film>,
	): Promise<Review> | null {
		return await this.reviewsRepository.findOne({ reviewerId, filmId });
	}

	async getReviewsbyReviewerId(reviewerId: string): Promise<ReviewsDetail[]> {
		const reviews = await this.reviewsRepository.find({ reviewerId }, [
			fieldsToPopulateReviewObject.filmId,
		]);
		return reviews.map((review) => this._getReviewDetails(review));
	}
	async getPlainReviewsbyReviewerId(reviewerId: string): Promise<Review[]> {
		return await this.reviewsRepository.find({ reviewerId }, [
			fieldsToPopulateReviewObject.filmId,
		]);
	}

	async getReviewsbyFilmId(filmId: string): Promise<ReviewsDetail[]> {
		const reviews = await this.reviewsRepository.find({ filmId }, [
			fieldsToPopulateReviewObject.reviewerId,
		]);
		return reviews.map((review) => this._getReviewDetails(review));
	}
	async getReviews(): Promise<Review[]> {
		const reviews = await this.reviewsRepository.find(
			{},
			fieldsToPopulateReviewArray,
		);
		return reviews.map((review) => this._getReviewDetails(review));
	}

	async createReview(createReviewDto: CreateReviewDto): Promise<ReviewsDetail> {
		const reviewListOfReviewer = (await this.getPlainReviewsbyReviewerId(
			createReviewDto.reviewerId,
		)) as ReviewDocument[];
		if (reviewListOfReviewer.length) {
			// the user has not reviewed the same film before
			const isFilmReviewed = reviewListOfReviewer.find((review) => {
				const existingFilmId = JSON.parse(
					JSON.stringify(review.filmId),
				) as ReviewDocument;
				return String(existingFilmId._id) === String(createReviewDto.filmId);
			});
			if (isFilmReviewed)
				throw new HttpException(
					`the reviewer ${createReviewDto.reviewerId} cannot create another review for the same film`,
					HttpStatus.FORBIDDEN,
				);
		}

		const review = await this.reviewsRepository.create(createReviewDto);
		return this._getReviewDetails(review);
	}

	async updateReview(
		reviewId: string | Partial<ReviewDocument>,
		reviewUpdates: UpdateReviewDto,
	): Promise<ReviewsDetail> {
		const review = await this.getReviewById(reviewId as string);
		if (!review)
			throw new HttpException(
				`the resource with id ${reviewId} does not exists`,
				HttpStatus.BAD_REQUEST,
			);

		const updatedReview = await this.reviewsRepository.findOneAndUpdate(
			{ _id: reviewId },
			reviewUpdates,
		);

		await updatedReview.populate(fieldsToPopulateReviewArray);
		return this._getReviewDetails(updatedReview);
	}

	async createManyReviews(
		createReviewDtos: CreateReviewDto[],
	): Promise<ReviewsDetail[]> {
		createReviewDtos.every(async (review) => {
			const reviewToCreate = await this.getReviewsbyReviewerId(
				review.reviewerId as string,
			);
			if (reviewToCreate)
				throw new HttpException(
					`the resource with id ${review.reviewerId} already exists`,
					HttpStatus.FORBIDDEN,
				);
		});

		const reviews = await this.reviewsRepository.insertMany(createReviewDtos);
		return reviews.map((review) => this._getReviewDetails(review));
	}
}
