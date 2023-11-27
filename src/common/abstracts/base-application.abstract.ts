export abstract class BaseApplication {
   abstract init(): Promise<any>;
   abstract start(): void;
}
