import {
  CreatePostDto,
  Post,
  PostsApi,
  UpdatePostDto,
} from '@repo/api-lib/api';
import { ApiClient } from '@repo/commons/api-client';

const api = ApiClient.use(PostsApi);

export async function fetchAllPosts(): Promise<Post[]> {
  const response = await api.postsControllerFindAll();

  return response.data;
}

export async function createPost(post: CreatePostDto) {
  const response = await api.postsControllerCreate(post);

  return response.data;
}

export async function updatePost(arg: { id: string; form: UpdatePostDto }) {
  const response = await api.postsControllerUpdate(arg.id, arg.form);

  return response.data;
}

export async function deletePost(id: string) {
  const response = await api.postsControllerRemove(id);

  return response.data;
}
