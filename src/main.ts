import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/swagger.config';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  app.use(compression());

  setupSwagger(app);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
