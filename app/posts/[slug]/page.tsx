import Image from 'next/image';
import Link from 'next/link';
import Markdown from './MDWithCode';
import Tags from '@/ui/Tags';
import BtnBack from '@/ui/BtnBack';
import Socials from '@/ui/Socials';
import { getPostContent, getSortedPosts } from '@/utils/getPosts';
import dateConverter from '@/utils/dateConverter';
import { GITHUB_URL } from '@/constants/paths';
import { SlugParams } from '@/types';
import { Metadata } from 'next/types';
import { inter } from '@/fonts';
import './post.css';
import '@/ui/note.css';

export default async function Post({ params: { slug } }: SlugParams) {
  const { content, data } = getPostContent(slug);

  return (
    <div id="post" className={inter.className}>
      <header>
        <BtnBack />
        <h1>{data.title}</h1>
        <Tags tags={data?.tags} />
        <time dateTime={data.date}>
          <i>{dateConverter(data.date)}</i>
        </time>
        <Image
          src={`/posts/${slug}/${data.image}`}
          alt={data.title}
          title={`photo by ${data.photoBy ?? 'unknown author'}`}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={320}
          height={200}
          priority
        />
      </header>
      <main>
        <Markdown content={content} />
        <Link
          href={`${GITHUB_URL}/edit/main/public/posts/${slug}/index.md`}
          className="edit-github"
          target="_blank"
        >
          Edit on GitHub
        </Link>
      </main>
      <footer id="post-footer">
        <span>&copy; {new Date().getFullYear()} Pavel Altov</span>
        <Socials />
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getSortedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params: { slug },
}: SlugParams): Promise<Metadata> {
  const { data } = getPostContent(slug);

  return {
    title: data.title,
    description: data.description,
    keywords: data.tags,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [
        {
          url: `/posts/${slug}/${data.image}`,
          width: 1200,
          height: 628,
        },
      ],
      url: `/posts/${slug}`,
    },
  };
}
