import { Request } from 'express';

export function extractJwtFromCookie(cookieName: string) {
  return (request: Request): string | null => request?.cookies?.[cookieName];
}
