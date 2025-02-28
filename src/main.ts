import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(config.port ?? 3000);
}
bootstrap();
