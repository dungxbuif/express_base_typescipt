import ControllerPathEnum from '../../common/enums/controller-path.enum';
import BaseAbstractController from '../../common/abstracts/base-controller.abstract';
import { Request, Response } from 'express';
import UserService from './user.service';

class UserController extends BaseAbstractController {
   _service: UserService;
   constructor() {
      super(ControllerPathEnum.USER);
      this._service = new UserService();
      this.initializeRoutes();
   }

   protected initializeRoutes() {
      this.router.get('', this.getAllUsers);
      this.router.post('', this.createUser);
   }

   private getAllUsers = async (request: Request, response: Response) => {
      const users = await this._service.getAll();
      response.send(users);
   };

   private createUser = async (request: Request, response: Response) => {
      const user = await this._service.create();
      response.send(user);
   };
}

export default UserController;
