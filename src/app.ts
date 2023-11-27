import * as express from 'express';
import { Express } from 'express-serve-static-core';
import { BaseApplication } from './common/abstracts/base-application.abstract';
import { Logger } from './core/logger/logger.service';
import IConfigService from './common/interfaces/environment/config-service.interface';
import configService from './core/config/config.service';
import { IAppEnvironment } from './common/interfaces/environment/app-invironment.inteface';
import { Controllers } from './controller';
import appExceptionMiddleware from './common/middlewares/app-exception.middleware';
import IController from 'common/interfaces/controller.interface';
import AppDatabase from './core/database';
import { PrismaClient } from '@prisma/client';
import BaseControllerConstructor from './common/types/base-controller.type';
export class Application extends BaseApplication {
   private _app: Express;
   private _config: IConfigService;
   constructor() {
      super();
   }

   get app(): Express {
      if (!this._app) {
         throw new Error('App not initialized');
      }
      return this._app;
   }
   async init() {
      const expressApp = express();
      this._app = expressApp;
      await this.initConfig();
      this.initRouter();
   }
   public async initConfig() {
      this._config = configService;
      await AppDatabase.connect<PrismaClient>();
   }

   private initRouter() {
      this.initializeMiddlewares();
      this.initializeControllers(Controllers);
      this.initializeErrorHandling();
   }

   private initializeMiddlewares() {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
   }
   private initializeControllers(controllers: any) {
      this.app.get('/health', (req, res) => {
         res.send('Working!');
      });
      this.app.get('/', (req, res) => {
         res.send('Hello world!');
      });
      controllers.forEach((controller: BaseControllerConstructor) => {
         const controllerInstance = new controller();
         this.app.use(`/${controllerInstance.path}`, controllerInstance.router);
      });
   }

   private initializeErrorHandling() {
      this.app.use(appExceptionMiddleware);
   }

   public start() {
      const { port } = this._config.get<IAppEnvironment>('app');
      this.app.listen(port, () => {
         Logger.info(`Server is running on port: ${port}`);
      });
   }
}
