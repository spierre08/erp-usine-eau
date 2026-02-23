import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AllExceptionsFilter } from './common/middleware/all-exceptions.filter';
import { NotFoundFilter } from './common/middleware/not-found-exception';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(new LoggerMiddleware().use);

  app.setGlobalPrefix('api/v1', {
    exclude: ['/health', '/'],
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new NotFoundFilter(), new AllExceptionsFilter());
  const port = process.env.PORT ? Number(process.env.PORT) : 8086;

  const seedService = app.get(SeedService);
  await seedService.onModuleInit();

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: ${port}`);
}
bootstrap();
