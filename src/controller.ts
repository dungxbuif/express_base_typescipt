import UserController from './modules/user/user.controller';
import TimesheetController from './modules/timesheet/timesheet.controller';
import BaseControllerConstructor from './common/types/base-controller.type';

export const Controllers: BaseControllerConstructor[] = [
   UserController,
   TimesheetController,
];
