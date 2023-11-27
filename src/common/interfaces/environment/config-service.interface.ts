import IEnvConfig from './env-config.inteface';

export default interface IConfigService {
   get<T>(key: keyof IEnvConfig): T;
}
