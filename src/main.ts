import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog Platform API')
    .setDescription('Scalable Blog API built with NestJS & Drizzle')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access_token',
    )
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const message = errors.flatMap(
          (err) => Object.values(err.constraints ?? {})[0],
        );

        return new BadRequestException(message);
      },
    }),
  );

  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
