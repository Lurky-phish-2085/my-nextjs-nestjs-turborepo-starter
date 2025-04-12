import { Cookie } from 'src/common/decorators/cookie.decorator';

export function AuthToken() {
  return Cookie('Authentication');
}
