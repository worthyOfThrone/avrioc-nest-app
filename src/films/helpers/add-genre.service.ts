import { Genre } from "src/genres/schemas/genre.schema";
import { Review } from "src/reviews/schemas/review.schema";

export class Resource {
	private readonly existingResources;
	private readonly newResources;

	constructor(existingResources = [], newResources) {
		this.existingResources = existingResources;
		this.newResources = newResources;
	}

	addResources() {
		const updates = new Set(this.existingResources);
		this.newResources.forEach((resource: Genre | Review) => updates.add(resource));
		return Array.from(updates);
	}
}