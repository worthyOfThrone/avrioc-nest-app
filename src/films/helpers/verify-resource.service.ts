export class VerifyResource {
	private readonly service;

	constructor(service) {
		this.service = service;
	}

	async verifyResource(resources) {
		let allObjectIdsVerified = true;
		if (resources && resources.length) {
			allObjectIdsVerified = await resources.every(async (resourceId) => {
				const resource = await this.service.resourceExistById(resourceId);
				if (resource) return true;
				return false;
			});
		}
		return allObjectIdsVerified;
	}
}
