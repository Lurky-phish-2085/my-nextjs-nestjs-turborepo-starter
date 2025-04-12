import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: { Authentication: string; Refresh: string };
}

export default RequestWithCookies;
