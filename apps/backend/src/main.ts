import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';

import { loadSwagger } from '@forexsystem/helpers/swagger/load.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';
  app.use(helmet());

  // console.log(configService);
  app.setGlobalPrefix(globalPrefix);
  // app.enableCors({ origin: configService.ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    })
  );

  // ✅ TODO
  // Implement a Global Response Interceptor
  loadSwagger(app);
  app.flushLogs();
  app.enableShutdownHooks();
  try {
    const port = parseInt(process.env.PORT) || 9000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  } catch (error) {
    Logger.warn(error);
  }
}

bootstrap();
