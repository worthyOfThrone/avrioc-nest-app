import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    /**
     * for development/debugging purpose until all necessary services/controllers are created,
     * setting log level to log
     */
    logger: ['log', 'error', 'warn'],
  });
  await app.listen(3000);
}
bootstrap();
