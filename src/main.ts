import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  
  if (process.env.NODE_ENV === 'production') {
    app.setGlobalPrefix('account-service');
  }

  await app.listen(3000);
}
bootstrap();
