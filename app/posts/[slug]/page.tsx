import Image from 'next/image';
import Link from 'next/link';
import Markdown from './MDWithCode';
import Tags from '@/ui/Tags';
import { getPostContent, getSortedPosts } from '@/utils/getPosts';
import dateConverter from '@/utils/dateConverter';
import { SlugParams } from '@/types';
import { Metadata } from 'next/types';
import { inter } from '@/fonts';

export default async function Post({ params: { slug } }: SlugParams) {
  const { content, data } = getPostContent(slug);

  return (
    <div id="post" className={inter.className}>
      <header>
        <Link href={'/'} className="btn-back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M16 8v-4l8 8-8 8v-4h-16l8-8h8z" />
          </svg>
          <span>Back to articles</span>
        </Link>
        <h1>{data.title}</h1>
        <Tags tags={data?.tags} />
        <time dateTime={data.date}>
          <i>{dateConverter(data.date)}</i>
        </time>
        <Image
          src={`/posts/${slug}/${data.image}`}
          alt={data.title}
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
      </main>
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
  };
}
