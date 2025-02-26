import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
