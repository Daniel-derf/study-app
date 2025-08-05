import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Study App - Backend')
    .setDescription('Backend de um App de estudos e produtividade')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove automaticamente campos não declarados no DTO
      forbidNonWhitelisted: true, // lança BadRequest se vier campo extra
      transform: true, // transforma payload em instâncias de DTO
      transformOptions: {
        enableImplicitConversion: true, // converte tipos primitivos (e.g. "123" → 123)
      },
      validationError: {
        target: false, // não expõe o objeto original no erro
        value: false, // não expõe o valor recebido no erro
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  Logger.debug(`Application started on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
