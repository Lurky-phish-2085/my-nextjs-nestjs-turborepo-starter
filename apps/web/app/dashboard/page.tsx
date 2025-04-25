'use client';

import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { handleFormError } from '@/lib/utils';
import { useAuthUser } from '@/providers/auth-user.provider';
import { useModal } from '@/providers/modal.provider';
import {
  createPost,
  deletePost,
  fetchAllPosts,
  updatePost,
} from '@/services/posts.service';
import { CreatePostDto, Post, UpdatePostDto } from '@repo/api-lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Page() {
  const { authUser } = useAuthUser();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
    initialData: [] as Post[],
  });

  return (
    <>
      <h1 className="text-2xl font-bold">You are now authenticated!</h1>
      <p>Hi, {authUser?.name}!</p>
      {authUser?.email}

      <CreatePostForm />

      <div className="mt-4 flex flex-col gap-4">
        {posts.map((post) => <PostCards key={post.id} post={post} />).reverse()}
      </div>
    </>
  );
}

function CreatePostForm() {
  const queryClient = useQueryClient();

  const form = useForm<CreatePostDto>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const {
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = form;

  const { mutate: createPostMutate, isPending } = useMutation({
    mutationFn: async (form: CreatePostDto) => {
      return await createPost(form);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      clearErrors();
      reset();
    },
    onError: async (error: AxiosError) => {
      handleFormError(error, {
        errorResolver: (response) => {
          if (!response.error) return;

          setError('root', { message: response.message });
        },
        fieldErrorsResolver: (field, message) => {
          setError(field as any, message);
        },
      });
    },
  });

  const submit = (values: CreatePostDto) => {
    createPostMutate(values);
  };

  return (
    <div className="border border-slate-400 rounded-md p-3 my-2">
      <Form {...form}>
        <form onSubmit={handleSubmit(submit)}>
          <FormField
            name="title"
            disabled={isPending}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="content"
            disabled={isPending}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input placeholder="Content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.root && <FormMessage>{errors.root.message}</FormMessage>}
          <Button className="mt-4" type="submit" disabled={isPending}>
            Post
          </Button>
        </form>
      </Form>
    </div>
  );
}

function PostCards({ post }: { post: Post }) {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const errorModal = useModal();

  const { author, title, content } = post;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitleValue, setEditTitle] = useState(title);
  const [editContentValue, setEditContent] = useState(content);

  const editingForm = useForm<UpdatePostDto>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const {
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = editingForm;

  const { mutate: updatePostMutate, isPending: isEditPending } = useMutation({
    mutationFn: async (values: { id: string; form: UpdatePostDto }) => {
      return await updatePost(values);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      clearErrors();
      reset();
    },
    onError: async (error: AxiosError) => {
      handleFormError(error, {
        errorResolver: (response) => {
          if (!response.error) return;

          setError('root', { message: response.message });
        },
        fieldErrorsResolver: (field, message) => {
          setError(field as any, message);
        },
      });
    },
  });

  const { mutate: deletePostMutate, isPending: isDeletePending } = useMutation({
    mutationFn: async (id: string) => {
      return deletePost(id);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: async (data) => {
      errorModal.open({
        title: 'Deletion Failed!',
        description: data.message,
        isModal: true,
      });
    },
  });

  const onEdit = (id: number, form: UpdatePostDto) => {
    console.log(JSON.stringify(form));
    setIsEditing(false);
    updatePostMutate({ id: id.toString(), form });
  };

  const onDelete = (id: number) => {
    deletePostMutate(id.toString());
  };

  const ownedByUser = authUser?.id === author.id;
  const isPending = isDeletePending || isEditPending;
  const hideManageButtons = !ownedByUser || isEditing;

  return (
    <div className="shadow-md bg-slate-100 p-2 flex flex-col gap-2">
      <div className="flex flex-col">
        <div className="font-semibold text-lg">{author.name}</div>
        <div className="text-slate-700 text-sm">{author.email}</div>
        <div className="text-slate-700 text-xs">
          {new Date(post.createdAt).toDateString()}
          <span>&nbsp;</span>
          {new Date(post.createdAt).toLocaleTimeString()}
          {post.updatedAt !== post.createdAt && (
            <>
              <span className="mx-2">&middot;</span>
              <span>edited</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {isEditing ? (
          <Form {...editingForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEdit(post.id, {
                  title: editTitleValue,
                  content: editContentValue,
                });
              }}
            >
              <FormField
                name="title"
                disabled={isPending}
                control={editingForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        {...field}
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitleValue}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.root && (
                      <FormMessage>{errors.root.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="content"
                disabled={isPending}
                control={editingForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Content"
                        {...field}
                        onChange={(e) => setEditContent(e.target.value)}
                        value={editContentValue}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.root && (
                      <FormMessage>{errors.root.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div className="mt-4">
                <Button type="submit" disabled={isPending}>
                  Done
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  type="submit"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="font-bold">{title}</div>
            <div>{content}</div>
          </>
        )}
      </div>
      {!hideManageButtons && (
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} disabled={isPending}>
            Edit
          </Button>
          <Button
            onClick={() => onDelete(post.id)}
            variant="destructive"
            disabled={isPending}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
