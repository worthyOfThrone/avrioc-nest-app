import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GenresController } from "./genres.controller";
import { GenresRepository } from "./genres.repository";
import { GenresService } from "./genres.service";
import { Genre, GenreSchema } from "./schemas/genre.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Genre.name, schema: GenreSchema }])],
    controllers: [GenresController],
    providers: [GenresService, GenresRepository],
    exports: [GenresService]
})

export class GenresModule {}
 