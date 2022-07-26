export class Errortype {
	statusCode: number;
	message: string;
}

export class ResourceNotFoundResponse extends Errortype {}
export class ResourceAlreadyExistsResponse extends Errortype {}
export class InternalServerError extends Errortype {}

export class UnAuthorizedResponse extends Errortype {}
export class PermissionDeniedResponse extends Errortype {}
