'use client';

import GuestLayout from '@/components/layouts/guest.layout';
import { cn } from '@/lib/utils';
import { fetchAllLinks } from '@/services/links.service';
import { useQuery } from '@tanstack/react-query';

export default function RootPage() {
  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['links'],
    queryFn: fetchAllLinks,
  });

  return (
    <GuestLayout>
      {isError ? (
        <div className="text-4xl text-center">SOMETHING WENT WRONG :(</div>
      ) : (
        <h1 className={cn('text-3xl', isLoading && 'text-4xl text-center')}>
          {isLoading
            ? '--- NOW LOADING ---'
            : 'Next.js (Shadcn + Tailwind), NestJS Turborepo Starter'}
        </h1>
      )}
      {links?.map((link) => (
        <div key={link.id} className="p-2 my-2 flex flex-col gap-1">
          <h2 className="text-2xl hover:underline text-blue-500 dark:text-blue-200">
            <a href={link.url} target="_blank" rel="noopenner noreferrer">
              {link.title}{' '}
            </a>
            <hr />
          </h2>
          <p>{link.description}</p>
        </div>
      ))}
    </GuestLayout>
  );
}
