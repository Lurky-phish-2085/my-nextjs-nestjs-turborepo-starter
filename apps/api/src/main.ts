import { ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DefaultExceptionResponse } from '@repo/api/types/default-exception-response.type';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './utils/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser());

  const openApiConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      in: 'cookie',
    })
    .addSecurity('refresh-token', {
      name: 'Refresh',
      type: 'apiKey',
      in: 'cookie',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer-token',
    )
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      type: DefaultExceptionResponse,
      example: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'error message',
        error: 'optional error message',
      },
    })
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, openApiConfig);

  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
