import { AuthApi } from '@repo/api-lib/api';
import { ApiClient } from '@repo/commons/api-client';
import { HttpStatusCode } from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Routes } from './constants/routes';

const api = ApiClient.use(AuthApi);

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('Authentication');
  const refreshToken = request.cookies.get('Refresh');

  const response = await api
    .authControllerAuthenticate({
      headers: {
        Authorization: `Bearer ${authToken?.value}`,
        Refresh: refreshToken?.value,
      },
    })
    .catch((data) => {
      return data;
    });

  const authExcludedRoutes = [
    Routes.AUTH_LOGIN.toString(),
    Routes.AUTH_REGISTER.toString(),
  ];

  if (
    authExcludedRoutes.includes(request.nextUrl.pathname) &&
    response.status === HttpStatusCode.Ok
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    request.nextUrl.pathname === '/dashboard' &&
    response.status !== HttpStatusCode.Ok
  ) {
    return NextResponse.redirect(new URL(Routes.AUTH_LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/auth/:path*'],
};
