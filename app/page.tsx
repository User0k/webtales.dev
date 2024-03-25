import Link from 'next/link';
import Image from 'next/image';
import { getSortedPosts } from './utils/getPosts';
import dateConverter from './utils/dateConverter';
import s from './home.module.css';

export default function Home() {
  const posts = getSortedPosts();
  return (
    <>
      <header>
        <h1 className={s.title}>Home</h1>
        {/* Navigation, search, logo... */}
      </header>
      <main>
        <section className={s.cards}>
          <h2>Related posts</h2>
          {posts.map((post) => (
            <article key={post.slug} className={s.card}>
              <Link href={`/posts/${post.slug}`} className={s.link}>
                <Image
                  src={`/posts/${post.slug}/${post.image}`}
                  alt={post.title}
                  width={640}
                  height={480}
                  priority={true}
                />
                <div className={s.ribbon}>{post.tags[0]}</div>
              </Link>
              <section className={s.content}>
                <h3>{post.title}</h3>
                <ul className={s.tags}>
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <time dateTime={post.date}>{dateConverter(post.date)}</time>
              </section>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
