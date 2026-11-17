import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: {
    // origin: process.env.SERVER,
    // credentials: true,
    // },
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes fields without decorators
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
