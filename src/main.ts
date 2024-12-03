import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix("api")

  app.use(cookieParser())

  app.enableCors({
    origin: ["http://192.168.1.7:3000" , "http://localhost:3000" , "http://atozerserver.3bbddns.com:21754"],
    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle('Atozer')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
