import { getPostContent, getPosts } from '@/utils/getPosts';
import Markdown from 'markdown-to-jsx';
import { SlugParams } from '@/types';
import { Metadata } from 'next/types';

export default function Post({ params: { slug } }: SlugParams) {
  const { content, data } = getPostContent(slug);

  return (
    <>
      <h1>{data.title}</h1>
      <Markdown>{content}</Markdown>
    </>
  );
}

export async function generateStaticParams() {
  const posts = getPosts();

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
