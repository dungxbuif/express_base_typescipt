import {
   Axios,
   AxiosError,
   AxiosRequestConfig,
   AxiosResponse,
   InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { HttpRegister } from './http-register';

const axios = require('axios');

interface IAppAxiosRequestConfig extends AxiosRequestConfig {
   time?: {
      startTime: Date;
   };
}

interface IAppAxiosResponseConfig extends AxiosResponse {
   config: InternalAxiosRequestConfig & {
      time: {
         startTime: Date;
         endTime: Date;
         duration?: number;
      };
   };
}

export class BaseHttpService {
   private _serviceName: string;
   private _defaultConfig: AxiosRequestConfig = {};
   private _service: any;
   constructor(serviceName?: string) {
      this._serviceName = serviceName;
      this.config();
   }
   private config() {
      this._service = axios.create(HttpRegister.getConfig(this._serviceName));
      this, this.setupInterceptors();
   }
   private setupInterceptors() {
      this._service.interceptors.request.use(
         (request: IAppAxiosRequestConfig) => {
            request.time = { startTime: new Date() };
            return request;
         },
         (err: AxiosError) => {
            return Promise.reject(err);
         }
      );

      this._service.interceptors.response.use(
         (response: IAppAxiosResponseConfig) => {
            response.config.time.endTime = new Date();
            response.config.time.duration =
               response.config.time.endTime.getTime() -
               response.config.time.startTime.getTime();
            console.log(
               `[${response.config.method.toUpperCase()}] ${
                  response.config.url
               } - ${response.config.time.duration}ms`
            );
            return response;
         },
         (err: AxiosError) => {
            return Promise.reject(err);
         }
      );
   }
   async baseHttp<T>(
      config: AxiosRequestConfig,
      filter?: Record<string, any>
   ): Promise<T> {
      const queryParam =
         filter && Object.keys(filter).length > 0
            ? `?${qs.stringify(filter)}`
            : '';
      config.url = config.url + queryParam;
      return this._service.request({ ...this._defaultConfig, ...config });
   }
   async baseGet<T = any>(
      url: string,
      filter?: Record<string, any>
   ): Promise<T> {
      return this.baseHttp<T>({ method: 'GET', url }, filter);
   }

   async basePost<T = any>(
      url: string,
      data?: any,
      filter?: Record<string, any>
   ): Promise<T> {
      return this.baseHttp<T>({ method: 'POST', url, data }, filter);
   }

   async basePut<T = any>(
      url: string,
      data?: any,
      filter?: Record<string, any>
   ): Promise<T> {
      return this.baseHttp<T>({ method: 'PUT', url, data }, filter);
   }

   async baseDelete<T = any>(
      url: string,
      filter?: Record<string, any>
   ): Promise<T> {
      return this.baseHttp<T>({ method: 'DELETE', url }, filter);
   }

   async basePatch<T = any>(
      url: string,
      data?: any,
      filter?: Record<string, any>
   ): Promise<T> {
      return this.baseHttp<T>({ method: 'PATCH', url, data }, filter);
   }
}
