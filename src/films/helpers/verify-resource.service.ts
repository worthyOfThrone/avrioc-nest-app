export class VerifyResource {
    private readonly service

    constructor(service) {
       this.service = service;
    }

    verifyResource(resources) {
        let allObjectIdsVerified = true;
		if (resources && resources.length) {
			allObjectIdsVerified = resources.every((resourceId) =>
				this.service.resourceExistById(resourceId),
			);
		}
        return allObjectIdsVerified;
    }
}