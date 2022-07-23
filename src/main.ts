import { NestFactory } from '@nestjs/core';
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
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
