import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 5000);

  const  ioServer = new IoAdapter(app);
  app.useWebSocketAdapter(ioServer);
}
bootstrap();
