import { fetchAllLinks } from '@/services/links.service';

export default async function HomePage() {
  const links = await fetchAllLinks();

  return (
    <>
      <h1 className="text-3xl">
        Next.js (Shadcn + Tailwind), NestJS Turborepo Starter
      </h1>
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
    </>
  );
}
