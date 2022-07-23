import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
import { GenresModule } from './genres/genres.module';
import { UsersModule } from './users/users.module';
dotenv.config();

@Module({
  imports: [
    GenresModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI
    ),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
