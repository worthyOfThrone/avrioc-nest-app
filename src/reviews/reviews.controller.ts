import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { FilmsService } from 'src/films/films.service';
import { FilmsDocument } from 'src/films/schemas/film.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@Controller('reviews')
export class ReviewsController {
	constructor(
		private readonly reviewsService: ReviewsService,
		private readonly usersService: UsersService,
		private readonly filmsService: FilmsService,
	) {}

	@Get(':reviewId')
	async getReview(@Param('reviewId') reviewId: string): Promise<Review> {
		return this.reviewsService.getReviewById(reviewId);
	}

	@Get('byReviewerId/:reviewerId')
	async getReviewByReviewerId(
		@Param('reviewerId') reviewerId: string,
	): Promise<Review[]> {
		const review = await this.reviewsService.getReviewsbyReviewerId(reviewerId);
		if (!review) {
			throw new HttpException('Review does not exists', 404);
		}
		return review;
	}

	@Get('byFilmId/:filmId')
	async getReviewByFilmId(
		@Param('filmId') filmId: string,
	): Promise<Review[]> {
		const reviews = await this.reviewsService.getReviewsbyFilmId(filmId);
		if (!reviews) {
			throw new HttpException('Review does not exists', 404);
		}
		return reviews;
	}

	@Get()
	async getReviews(): Promise<Review[]> {
		return this.reviewsService.getReviews();
	}

	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	async createReview(
		@Body() createReviewDto: CreateReviewDto,
	): Promise<Review> {
		// create only if a user is reviewer
		const user = (await this.usersService.getUserById(
			createReviewDto.reviewerId,
		)) as UserDocument;
		if (!user && !user.isReviewer) {
			throw new HttpException('permission to write review is denied', 501);
		}

		// create only if a film id is valid
		const film = (await this.filmsService.getFilmById(
			createReviewDto.filmId,
		)) as FilmsDocument;
		if (!film) {
			throw new HttpException('permission to write review is denied', 501);
		}
		createReviewDto.filmId = film._id;

		return this.reviewsService.createReview(createReviewDto);
	}

	@Patch(':reviewId')
	async updateReview(
		@Param('reviewId') reviewId: string,
		@Body() updateReviewDto: UpdateReviewDto,
	): Promise<Review> {
		return this.reviewsService.updateReview(reviewId, updateReviewDto);
	}
}
