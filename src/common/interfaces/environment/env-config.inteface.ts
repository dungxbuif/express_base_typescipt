import { IAppEnvironment } from './app-invironment.inteface';
import { IInternalToolEnvironment } from './internal-tool.inteface';

export default interface IEnvConfig {
   app: IAppEnvironment;
   KomuService: IInternalToolEnvironment;
   TimesheetService: IInternalToolEnvironment;
   ProjectService: IInternalToolEnvironment;
}
