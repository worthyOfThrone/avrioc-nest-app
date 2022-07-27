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
import {
	ApiBadGatewayResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
	PermissionDeniedResponse,
	ResourceNotFoundResponse,
	UnAuthorizedResponse,
} from 'src/auth/dto/interfaces/auth-error-interface.dto';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { FilmsDetail } from 'src/films/dto/interfaces/film-interface.dto';
import { FilmsService } from 'src/films/films.service';
import { FilmsDocument } from 'src/films/schemas/film.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import {
	AllReviewsDetailResponse,
	CreateReviewDto,
	ReviewDetailsResponse,
} from './dto/create-review.dto';
import { ReviewsDetail } from './dto/interfaces/review-interface.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@ApiTags('Review Module')
@Controller('reviews')
export class ReviewsController {
	constructor(
		private readonly reviewsService: ReviewsService,
		private readonly usersService: UsersService,
		private readonly filmsService: FilmsService,
	) {}

	@UseGuards(JwtGuard)
	@Get(':reviewId')
	@ApiOperation({ summary: 'get review by id' })
	@ApiBearerAuth('jwt')
	@ApiNotFoundResponse({
		description: 'review does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'review of respective id',
		type: ReviewDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getReview(@Param('reviewId') reviewId: string): Promise<ReviewsDetail> {
		const review = await this.reviewsService.getReviewById(reviewId);
		if (!review)
			throw new HttpException(
				`the resource with ${reviewId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		return review;
	}

	@UseGuards(JwtGuard)
	@Get('byReviewerId/:reviewerId')
	@ApiOperation({ summary: "get review by reviewer's id" })
	@ApiBearerAuth('jwt')
	@ApiNotFoundResponse({
		description: 'review does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'review details array',
		type: ReviewDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getReviewByReviewerId(
		@Param('reviewerId') reviewerId: string,
	): Promise<{ reviews: ReviewsDetail[] }> {
		const reviews = await this.reviewsService.getReviewsbyReviewerId(
			reviewerId,
		);
		if (!reviews) {
			throw new HttpException(
				`the resource with ${reviewerId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return { reviews };
	}

	@UseGuards(JwtGuard)
	@Get('byFilmId/:filmId')
	@ApiOperation({ summary: 'get review by film id' })
	@ApiBearerAuth('jwt')
	@ApiNotFoundResponse({
		description: 'review does not exist',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'review details array',
		type: ReviewDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getReviewByFilmId(
		@Param('filmId') filmId: string,
	): Promise<{ reviews: ReviewsDetail[] }> {
		const reviews = await this.reviewsService.getReviewsbyFilmId(filmId);
		if (!reviews) {
			throw new HttpException(
				`the resource with ${filmId} does not exist`,
				HttpStatus.NOT_FOUND,
			);
		}
		return { reviews };
	}

	@UseGuards(JwtGuard)
	@Get()
	@ApiOperation({ summary: 'get all reviews' })
	@ApiBearerAuth('jwt')
	@ApiOkResponse({
		description: 'review details array',
		type: AllReviewsDetailResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async getReviews(): Promise<{ reviews: Review[] }> {
		const reviews = await this.reviewsService.getReviews();
		return {
			reviews,
		};
	}

	@UseGuards(JwtGuard)
	@Post()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@ApiOperation({ summary: 'create reviews' })
	@ApiBearerAuth('jwt')
	@ApiForbiddenResponse({
		description: 'permission to write/create review is denied',
		type: PermissionDeniedResponse,
	})
	@ApiOkResponse({
		description: 'review is created',
		type: ReviewDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async createReview(
		@Body() createReviewDto: CreateReviewDto,
	): Promise<Review> {
		console.log(createReviewDto);
		if (createReviewDto.reviewerId === "") {
			throw new HttpException(
				'reviewer id is required',
				HttpStatus.FORBIDDEN,
			);
		}
		// create only if a film id is valid
		const film = await this.filmsService.getFilmById(createReviewDto.filmId);
		if (!film) {
			throw new HttpException(
				'the film to write review does not exists',
				HttpStatus.FORBIDDEN,
			);
		}

		return this.reviewsService.createReview(createReviewDto);
	}

	@UseGuards(JwtGuard)
	@Patch(':reviewId')
	@ApiOperation({ summary: 'update a review' })
	@ApiBearerAuth('jwt')
	@ApiBadGatewayResponse({
		description: 'the review does not exists',
		type: ResourceNotFoundResponse,
	})
	@ApiOkResponse({
		description: 'review is updated',
		type: ReviewDetailsResponse,
	})
	@ApiUnauthorizedResponse({
		description: 'unauthorize request',
		type: UnAuthorizedResponse,
	})
	async updateReview(
		@Param('reviewId') reviewId: string,
		@Body() updateReviewDto: UpdateReviewDto,
	): Promise<Review> {
		return this.reviewsService.updateReview(reviewId, updateReviewDto);
	}
}
