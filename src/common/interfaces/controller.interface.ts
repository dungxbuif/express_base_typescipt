import { Router } from 'express';
import ControllerPathEnum from '../enums/controller-path.enum';

interface IController {
   path: ControllerPathEnum;
   router: Router;
}

export default IController;
