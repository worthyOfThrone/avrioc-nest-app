import { ObjectId } from 'mongoose';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Review, ReviewDocument } from 'src/reviews/schemas/review.schema';
import { User } from 'src/users/schemas/user.schema';
import { Film } from '../schemas/film.schema';

export class ReviewsResource {
	private readonly newResource: CreateReviewDto;
	private readonly service: ReviewsService;
	private resourceId: Partial<ReviewDocument>;

	constructor(newResource: CreateReviewDto, service: ReviewsService) {
		this.service = service;
		this.newResource = newResource;
		this.resourceId = null;
	}

	async createResources(): Promise<Review> {
		const newlyCreatedResource = (await this.service.createReview(
			this.newResource,
		)) as ReviewDocument;
		this.resourceId = newlyCreatedResource.id;
		return newlyCreatedResource;
	}

	async ifExistis (): Promise<boolean> {
		const existingReview = (await this.service.getReviewbyReviewerIdAndFilmId(
			this.newResource.reviewerId as Partial<User>,
			this.newResource.filmId as Partial<Film>
		)) as ReviewDocument;
		if (existingReview) {
			this.resourceId = existingReview._id || existingReview.id;
			return true;
		}
	} 

	async updateResources(): Promise<Review> {
		return await this.service.updateReview(
			this.resourceId,
			this.newResource,
		);
		
	}

	addResources(
		existingResources: Partial<ReviewDocument>[],
	): Partial<ReviewDocument>[] {
		const updates = new Set(existingResources);
		return Array.from(updates.add(this.resourceId));
	}
}
