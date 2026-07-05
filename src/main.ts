// Main entry point - NestJS application bootstrap
import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';

// Windows par system DNS kabhi Node ke SRV lookups fail kar deta hai (MongoDB Atlas).
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS enable karein Flutter app ke liye
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  const port = process.env.PORT || 3000;
  // '0.0.0.0' lagane se backend network ke har device ke liye available ho jata hai
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on http://0.0.0.0:${port}/api`);
}

bootstrap();
