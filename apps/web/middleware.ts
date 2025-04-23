import { AuthApi } from '@repo/api-lib/api';
import { ApiClient } from '@repo/commons/api-client';
import { AxiosHeaders, HttpStatusCode } from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Routes } from './constants/routes';

const api = ApiClient.use(AuthApi);

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const accessToken = cookies.get('Authentication');
  const refreshToken = cookies.get('Refresh');

  let authResponse = await api
    .authControllerAuthenticate({
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    })
    .catch((data) => data);

  let responseHeaders = new Headers();

  if (authResponse.status !== HttpStatusCode.Ok) {
    const newAccessToken = await api
      .authControllerRefresh({
        headers: {
          Cookie: `Refresh=${refreshToken?.value};`,
        },
      })
      .then((data) => {
        const { headers } = data;

        let setCookie = null;

        if (headers instanceof AxiosHeaders) {
          setCookie = headers.get('Set-Cookie');
        }

        if (setCookie) {
          responseHeaders.set('Set-Cookie', setCookie.toString());
        }

        return data.data.accessToken;
      })
      .catch((_) => null);

    if (newAccessToken) {
      authResponse = await api
        .authControllerAuthenticate({
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        })
        .catch((data) => data);
    }
  }

  const authExcludedRoutes = [
    Routes.AUTH_LOGIN.toString(),
    Routes.AUTH_REGISTER.toString(),
  ];

  if (
    authExcludedRoutes.includes(request.nextUrl.pathname) &&
    authResponse.status === HttpStatusCode.Ok
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    request.nextUrl.pathname === '/dashboard' &&
    authResponse.status !== HttpStatusCode.Ok
  ) {
    return NextResponse.redirect(new URL(Routes.AUTH_LOGIN, request.url));
  }

  return NextResponse.next({
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ['/dashboard', '/auth/:path*'],
};
