import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap — Application entry point
 *
 * Global configuration:
 *   - ValidationPipe: auto-validates all DTOs with class-validator
 *   - Swagger: auto-generates OpenAPI spec from decorators
 *
 * TODO: add global exception filter, logging interceptor, CORS config
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,        // Auto-cast query params to their TS types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Book Summary API')
    .setDescription('API for uploading books, generating summaries, quizzes, and tracking progress')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api/v1`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
