import ControllerPathEnum from '../../common/enums/controller-path.enum';
import BaseAbstractController from '../../common/abstracts/base-controller.abstract';
import { Request, Response } from 'express';
import TimesheetService from './timesheet.service';

class TimesheetController extends BaseAbstractController {
   _service: TimesheetService;
   constructor() {
      super(ControllerPathEnum.TIMESHEET);
      this._service = new TimesheetService();
      this.initializeRoutes();
   }

   protected initializeRoutes() {
      this.router.get('', this.getAllTimesheets);
   }

   private getAllTimesheets = async (request: Request, response: Response) => {
      const Timesheets = await this._service.get();
      response.send(Timesheets.data.result);
   };
}

export default TimesheetController;
