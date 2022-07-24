import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
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

	@UseGuards(JwtGuard)
	@Get(':reviewId')
	async getReview(@Param('reviewId') reviewId: string): Promise<Review> {
		const review = this.reviewsService.getReviewById(reviewId);
		if (!review)
			throw new HttpException(
				`the resource with ${reviewId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		return review;
	}

	@UseGuards(JwtGuard)
	@Get('byReviewerId/:reviewerId')
	async getReviewByReviewerId(
		@Param('reviewerId') reviewerId: string,
	): Promise<Review[]> {
		const review = await this.reviewsService.getReviewsbyReviewerId(reviewerId);
		if (!review) {
			throw new HttpException(
				`the resource with ${reviewerId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return review;
	}

	@UseGuards(JwtGuard)
	@Get('byFilmId/:filmId')
	async getReviewByFilmId(@Param('filmId') filmId: string): Promise<Review[]> {
		const reviews = await this.reviewsService.getReviewsbyFilmId(filmId);
		if (!reviews) {
			throw new HttpException(
				`the resource with ${filmId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return reviews;
	}

	@UseGuards(JwtGuard)
	@Get()
	async getReviews(): Promise<Review[]> {
		return this.reviewsService.getReviews();
	}

	@UseGuards(JwtGuard)
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
			throw new HttpException('permission to write review is denied', HttpStatus.FORBIDDEN);
		}

		// create only if a film id is valid
		const film = (await this.filmsService.getFilmById(
			createReviewDto.filmId,
		)) as FilmsDocument;
		if (!film) {
			throw new HttpException('permission to write review is denied', HttpStatus.FORBIDDEN);
		}
		createReviewDto.filmId = film._id;

		return this.reviewsService.createReview(createReviewDto);
	}

	@UseGuards(JwtGuard)
	@Patch(':reviewId')
	async updateReview(
		@Param('reviewId') reviewId: string,
		@Body() updateReviewDto: UpdateReviewDto,
	): Promise<Review> {
		return this.reviewsService.updateReview(reviewId, updateReviewDto);
	}
}
