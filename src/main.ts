import { NestFactory } from '@nestjs/core';
import {
	DocumentBuilder,
	SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		/**
		 * for development/debugging purpose until all necessary services/controllers are created,
		 * setting log level to log
		 */
		logger: ['log', 'error', 'warn'],
	});
	app.setGlobalPrefix('api/v1');
	const config = new DocumentBuilder()
		.setTitle('Avrioc Nestjs App')
		.setDescription('A Nest js application to demonstrate technical skills')
		.setVersion('v1')
		.addBearerAuth(
			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			'jwt',
		)
		.build();

	const options: SwaggerDocumentOptions = {
		deepScanRoutes: true,
	};
	const document = SwaggerModule.createDocument(app, config, options);
	SwaggerModule.setup('api/v1', app, document);

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	// if using third party APIs, setup a request timeout for security purpose
	// dependency => a timeout property in seconds and lodash(optional)
	// const requestTimeout = _.toNumber(process.env.timeout || );
	// if (requestTimeout) {
	//   app.use(connectTimeout(requestTimeout.toString()));
	// }

	await app.listen(3000);
}
bootstrap();
