import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Nginx 설정대로 모든 백엔드 라우트에 '/api'
  app.setGlobalPrefix('api');

  // Cors 방지
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
