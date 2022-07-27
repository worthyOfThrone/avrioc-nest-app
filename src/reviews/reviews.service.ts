import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { Film, FilmsDocument } from 'src/films/schemas/film.schema';
import { loggerMessages } from 'src/lib/logger';
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
	private readonly logger = new Logger(ReviewsService.name);

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
		if (review) {
			this.logger.log(
				`[getReviewById]: ${loggerMessages.FOUND} ${JSON.stringify(review)}`,
			);
			return this._getReviewDetails(
				await review.populate(fieldsToPopulateReviewArray),
			);
		}
		this.logger.log(
			`[getReviewById]: ${loggerMessages.NOT_FOUND} ${JSON.stringify(_id)}`,
		);

		throw new HttpException(
			`the resource with id ${_id} does not exists`,
			HttpStatus.NOT_FOUND,
		);
	}

	async resourceExistById(review: ReviewDocument): Promise<Review> {
		const resource = await this.reviewsRepository.findOne({ _id: review._id });
		const logMessage = resource
			? loggerMessages.FOUND + JSON.stringify(resource)
			: `${loggerMessages.NOT_FOUND} ${review._id}`;

		this.logger.log(`[resourceExistById]: ${logMessage}`);
		
		return resource;
	}

	async getReviewbyReviewerIdAndFilmId(
		reviewerId: Partial<User>,
		filmId: Partial<Film>,
	): Promise<Review> | null {
		const resource = await this.reviewsRepository.findOne({ reviewerId, filmId });
		const logMessage = resource
			? loggerMessages.FOUND + JSON.stringify(resource)
			: `${loggerMessages.NOT_FOUND} reviewerId: ${reviewerId} filmId: ${filmId}`;

		this.logger.log(`[resourceExistById]: ${logMessage}`);
		
		return resource;
	}

	async getReviewsbyReviewerId(reviewerId: string): Promise<ReviewsDetail[]> {
		const reviews = await this.reviewsRepository.find({ reviewerId }, [
			fieldsToPopulateReviewObject.filmId,
		]);
		this.logger.log(
			`[getReviewsbyReviewerId]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(reviews)}`,
		);
		return reviews.map((review) => this._getReviewDetails(review));
	}
	async getPlainReviewsbyReviewerId(reviewerId: string): Promise<Review[]> {
		const reviews = await this.reviewsRepository.find({ reviewerId }, [
			fieldsToPopulateReviewObject.filmId,
		]);
		this.logger.log(
			`[getPlainReviewsbyReviewerId]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(reviews)}`,
		);
		return reviews;
	}

	async getReviewsbyFilmId(filmId: string): Promise<ReviewsDetail[]> {
		const reviews = await this.reviewsRepository.find({ filmId }, [
			fieldsToPopulateReviewObject.reviewerId,
		]);
		this.logger.log(
			`[getReviewsbyFilmId]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(reviews)}`,
		);
		return reviews.map((review) => this._getReviewDetails(review));
	}
	async getReviews(): Promise<Review[]> {
		const reviews = await this.reviewsRepository.find(
			{},
			fieldsToPopulateReviewArray,
		);
		this.logger.log(
			`[getReviews]: ${loggerMessages.GENERIC_PLURAL} ${JSON.stringify(reviews)}`,
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
				this.logger.log(
					`[createReview]: ${loggerMessages.FORBIDDON} ${JSON.stringify(createReviewDto.reviewerId)}`,
				);
				throw new HttpException(
					`the reviewer ${createReviewDto.reviewerId} cannot create another review for the same film`,
					HttpStatus.FORBIDDEN,
				);
		}

		const review = await this.reviewsRepository.create(createReviewDto);
		this.logger.log(
			`[createReview]: ${loggerMessages.CREATED} ${JSON.stringify(review)}`,
		);
		return this._getReviewDetails(review);
	}

	async updateReview(
		reviewId: string | Partial<ReviewDocument>,
		reviewUpdates: UpdateReviewDto,
	): Promise<ReviewsDetail> {
		const review = await this.resourceExistById({_id: reviewId } as ReviewDocument);
		if (!review) {
			// the message must already be logged in resourceExistById call, hence skip it
			throw new HttpException(
				`the resource with id ${reviewId} does not exists`,
				HttpStatus.BAD_REQUEST,
			);
		}

		const updatedReview = await this.reviewsRepository.findOneAndUpdate(
			{ _id: reviewId },
			reviewUpdates,
		);

		await updatedReview.populate(fieldsToPopulateReviewArray);
		this.logger.log(
			`[updateReview]: ${loggerMessages.UPDATED} ${JSON.stringify(updatedReview)}`,
		);
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
			{
				this.logger.log(
					`[createManyReviews]: ${loggerMessages.FORBIDDON} ${JSON.stringify(reviewToCreate)}`,
				);
				throw new HttpException(
					`the resource with id ${review.reviewerId} already exists`,
					HttpStatus.FORBIDDEN,
				);}
		});

		const reviews = await this.reviewsRepository.insertMany(createReviewDtos);
		this.logger.log(
			`[createManyReviews]: ${loggerMessages.CREATED} ${JSON.stringify(reviews)}`,
		);
		return reviews.map((review) => this._getReviewDetails(review));
	}
}
