import { BaseHttpService } from './../../core/httpService/http.service';
class TimesheetService {
   private _httpService: BaseHttpService;
   constructor() {
      this._httpService = new BaseHttpService(TimesheetService.name);
   }
   async get() {
      return this._httpService.baseGet(
         'https://timesheetapi.nccsoft.vn/api/services/app/HRM/GetAllProject'
      );
   }
}

export default TimesheetService;
