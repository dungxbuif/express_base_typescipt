import { CreateAxiosDefaults } from 'axios';
import TimesheetService from '../../modules/timesheet/timesheet.service';
import { Agent } from 'https';

export class HttpRegister {
   static _defaultConfig: CreateAxiosDefaults = {
      httpsAgent: new Agent({
         rejectUnauthorized: false,
      }),
      headers: {
         'Content-Type': 'application/json',
      },
   };
   static getConfig(configName: string): CreateAxiosDefaults {
      switch (configName) {
         case TimesheetService.name:
            return {
               ...HttpRegister._defaultConfig,
               headers: {
                  ...HttpRegister._defaultConfig.headers,
                  ['X-Secret-Key']: '12345678',
               },
            };
         default:
            return HttpRegister._defaultConfig;
      }
   }
}
