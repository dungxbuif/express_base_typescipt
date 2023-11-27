import IConfigService from '../../common/interfaces/environment/config-service.interface';
import IEnvConfig from '../../common/interfaces/environment/env-config.inteface';
import 'dotenv/config';

class ConfigService implements IConfigService {
   private envConfig: IEnvConfig;
   constructor() {
      this.envConfig = {
         app: {
            port: Number(process.env.PORT) || 5000,
            name: process.env.APP_NAME || 'Daily Dashboard',
         },
         KomuService: {
            baseUrl:
               process.env.KOMU_SERVICE_BASE_URL ||
               'http://komuapi.nccsoft.vn/',
            apiKey: process.env.KOMU_SERVICE_API_KEY || '12345678',
         },
         TimesheetService: {
            baseUrl:
               process.env.TIMESHEET_SERVICE_BASE_URL ||
               'http://timesheetapi.nccsoft.vn/',
            apiKey: process.env.TIMESHEET_SERVICE_API_KEY || ' ',
         },
         ProjectService: {
            baseUrl:
               process.env.PROJECT_SERVICE_BASE_URL ||
               'http://project-api.nccsoft.vn/',
            apiKey: process.env.PROJECT_SERVICE_API_KEY || '12345678',
         },
      };
   }

   get<T>(key: keyof IEnvConfig): T {
      return this.envConfig[key] as T;
   }
}

export default new ConfigService();
