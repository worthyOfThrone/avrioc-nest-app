import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
import { GenresModule } from './genres/genres.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI
    ),
    GenresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
