import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { CONFIG_NAMESPACE, type AppConfig } from './config/configuration';

export const API_PREFIX = 'api';
export const DOCS_PATH = 'docs';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app
    .get(ConfigService<{ [CONFIG_NAMESPACE]: AppConfig }, true>)
    .getOrThrow<AppConfig>(CONFIG_NAMESPACE, { infer: true });

  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({ origin: config.corsOrigins, credentials: true });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  if (config.nodeEnv !== 'production') {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('ccscammers-bets API')
        .setDescription('Bet tracking API backed by RavenDB.')
        .setVersion('0.0.0')
        .build(),
    );
    SwaggerModule.setup(`${API_PREFIX}/${DOCS_PATH}`, app, document);
  }

  await app.listen(config.port);
  new Logger('Bootstrap').log(`API listening on http://localhost:${config.port}/${API_PREFIX}`);
}

bootstrap().catch((error: unknown) => {
  new Logger('Bootstrap').error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
