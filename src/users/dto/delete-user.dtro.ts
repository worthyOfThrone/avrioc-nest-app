
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteUserDto {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}