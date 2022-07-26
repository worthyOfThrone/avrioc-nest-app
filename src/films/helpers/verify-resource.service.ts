export class VerifyResource {
	private readonly service;

	constructor(service) {
		this.service = service;
	}

	verifyResource(resources) {
		let allObjectIdsVerified = true;
		if (resources && resources.length) {
			allObjectIdsVerified = resources.every((resourceId) => {
				const resource = this.service.resourceExistById(resourceId);
				if (resource) return true;
				return false;
			});
		}
		return allObjectIdsVerified;
	}
}
