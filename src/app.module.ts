import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
dotenv.config();

@Module({
  imports: [
    FilmsModule,
    GenresModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI
    ),
    ReviewsModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
