import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './auth/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? 'account-service' : '')

  // Enable CORS for Swagger UI
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Account Service')
    .setDescription('Account Service API Documentation')
    .setVersion('0.1')
    .addTag('Account', 'Endpoints for Account API integrated with queue (ask Evan how to listen for user creaton/update/deletion)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false });

  SwaggerModule.setup(
    process.env.NODE_ENV === 'production' ? 'account-service/docs' : 'docs', 
    app, 
    documentFactory
  );

  await app.listen(3000);
}
bootstrap();
