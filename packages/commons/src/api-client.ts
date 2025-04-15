import axios from 'axios';
import { removeTrailingSlash } from './utils/string';

const API_BASE_URL = removeTrailingSlash(
  process.env.API_BASE_URL ?? 'http://localhost:3000',
);

function createApiClient(baseURL: string) {
  const axiosInstance = axios.create();

  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.baseURL = baseURL;

  return {
    use: <ApiType>(api: new (...args: any[]) => ApiType): ApiType =>
      new api(undefined, baseURL, axiosInstance),
    instance: axiosInstance,
  };
}

export const ApiClient = createApiClient(API_BASE_URL || '');
