import ControllerPathEnum from 'common/enums/controller-path.enum';
import IController from 'common/interfaces/controller.interface';
import { Router } from 'express';

abstract class BaseAbstractController {
   private _path: ControllerPathEnum;
   private _router: Router;
   constructor(path: ControllerPathEnum) {
      this._path = path;
      this._router = Router();
      this.initializeRoutes;
   }

   protected abstract initializeRoutes(): void;

   get router(): Router {
      return this._router;
   }
   get path(): ControllerPathEnum {
      return this._path;
   }
}

export default BaseAbstractController;
