import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
      allowedHeaders:"*",
      origin: "*"
  });
  await app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
bootstrap();
