import { User, UsersApi } from '@repo/api-lib/api';
import { ApiClient } from '@repo/commons/api-client';

const api = ApiClient.use(UsersApi);

export async function fetchAuthUserDetails(): Promise<User> {
  const response = await api.usersControllerFetchAuthUserDetails();

  return response.data;
}
