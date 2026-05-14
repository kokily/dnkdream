import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Nginx 설정대로 모든 백엔드 라우트에 '/api'
  app.setGlobalPrefix('api');

  // Cors 방지
  app.enableCors();

  // Swagger setting
  const config = new DocumentBuilder()
    .setTitle('D&K Dreams Blog API')
    .setDescription('블로그 관리를 위한 백엔드 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
