import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from './utils/getPosts';

export default function Home() {
  const posts = getPosts();
  return (
    <main>
      <h1>Home</h1>
      <div>
        {posts.map((post) => (
          <div key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <Image
                src={`/posts/${post.slug}/${post.image}`}
                alt={post.title}
                width={400}
                height={200}
                priority={true}
              />
            </Link>
            <div>{post.tags[0]}</div>
            <h3>{post.title}</h3>
          </div>
        ))}
      </div>
    </main>
  );
}
