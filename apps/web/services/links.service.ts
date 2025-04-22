import { LinksApi } from '@repo/api-lib/api';
import { Link } from '@repo/api/links/entities/link.entity';
import { ApiClient } from '@repo/commons/api-client';

const api = ApiClient.use(LinksApi);

export async function fetchAllLinks(): Promise<Link[]> {
  const response = await api.linksControllerFindAll();

  return response.data;
}
