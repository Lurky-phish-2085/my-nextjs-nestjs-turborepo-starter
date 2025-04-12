import { Cookie } from 'src/common/decorators/cookie.decorator';

export function RefreshToken() {
  return Cookie('Refresh');
}
