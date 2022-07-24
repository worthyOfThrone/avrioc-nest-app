import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
// import * as dotenv from 'dotenv';
// dotenv.config();
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		FilmsModule,
		GenresModule,
		MongooseModule.forRoot(process.env.MONGODB_URI, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useCreateIndex: true,
		}),
		ReviewsModule,
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
