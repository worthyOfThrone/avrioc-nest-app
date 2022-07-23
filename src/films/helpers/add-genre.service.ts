export class Resource {
	private readonly existingResources;
	private readonly newResources;

	constructor(existingResources = [], newResources) {
		this.existingResources = existingResources;
		this.newResources = newResources;
	}

	addResources() {
		const updates = new Set(this.existingResources);
		this.newResources.forEach((resource) => updates.add(resource));
		return Array.from(updates);
	}
}