import { getPostContent, getSortedPosts } from '@/utils/getPosts';
import Image from 'next/image';
import { SlugParams } from '@/types';
import { Metadata } from 'next/types';
import Markdown from './MDWithCode';

export default async function Post({ params: { slug } }: SlugParams) {
  const { content, data } = getPostContent(slug);

  return (
    <div>
      <h1>{data.title}</h1>
      <Image
        src={`/posts/${slug}/${data.image}`}
        alt={data.title}
        width={400}
        height={200}
      />
      <Markdown content={content} />
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
