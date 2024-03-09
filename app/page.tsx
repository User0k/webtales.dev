import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from './utils/getPosts';

export default function Home() {
  const posts = getPosts();
  return (
    <main>
      <h1>Home</h1>
      <div className="container">
        {posts.map((post) => (
          <div key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <h3>{post.title}</h3>
              <Image
                src={post.image}
                alt={post.title}
                width={300}
                height={200}
              />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
