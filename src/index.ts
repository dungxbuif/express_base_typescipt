import { Application } from './app';

async function bootstrap() {
   const app = new Application();
   await app.init();
   app.start();
}

bootstrap();

process.on('uncaughtException', (error) => {
   console.log('uncaughtException', error);
});
process.on('unhandledRejection', (error) => {
   console.log('unhandledRejection', error);
});
