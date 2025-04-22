import {
  AuthApi,
  DefaultExceptionResponse,
  LoginResponseDto,
  LoginUserDto,
  RegisterUserDto,
} from '@repo/api-lib/api';
import { RegisterUserResponseDto } from '@repo/api/auth/dto/register-user.response.dto';
import { ApiClient } from '@repo/commons/api-client';

const api = ApiClient.use(AuthApi);

export async function register(
  registerDto: RegisterUserDto,
): Promise<RegisterUserResponseDto | DefaultExceptionResponse> {
  const response = await api.authControllerRegister(registerDto);

  return response.data;
}

export async function login(
  loginDto: LoginUserDto,
): Promise<LoginResponseDto | DefaultExceptionResponse> {
  const response = await api.authControllerLogin(loginDto);

  return response.data;
}

export async function logout() {
  const response = await api.authControllerLogout();

  return response.data;
}
