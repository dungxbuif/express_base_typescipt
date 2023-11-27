import IConnectOption from './intefaces/connect-option.interface';

export default abstract class AbstractDatabase {
   abstract connect<T>(config: IConnectOption<T>): Promise<void>;
   abstract disconnect(): Promise<void>;
}
