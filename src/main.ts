import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseException, ValidationPipe } from './_core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('port-here');
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new ResponseException());
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);
  console.log(`port::::${config.get('service.port')}`);

  if (config.get('api.enable_swagger')) {
    const options = new DocumentBuilder()
      .setTitle('Weedle Core Service')
      .setDescription('The Weedle Core Service API description')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('', app, document);
  }

  await app.listen(config.get('service.port'), () => {
    Logger.log(`Service Running @ ::: ${config.get('service.host')}`);
  });
}
bootstrap();
