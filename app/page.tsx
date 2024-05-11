import Link from 'next/link';
import Image from 'next/image';
import Tags from './ui/Tags';
import { getSortedPosts } from './utils/getPosts';
import dateConverter from './utils/dateConverter';
import generateRibbonColors from './utils/generateRibbonColors';
import { inter } from './fonts';
import './home.css';

export default function Home() {
  const posts = getSortedPosts();
  return (
    <>
      <header className={inter.className}>
        <h1 className="title">Home</h1>
        {/* Navigation, search, logo... */}
      </header>
      <main className={inter.className}>
        <section className="cards">
          <h2 className="fw-300">Related posts</h2>
          {posts.map((post) => (
            <article key={post.slug} className="card">
              <Link href={`/posts/${post.slug}`} className="card-link">
                <Image
                  src={`/posts/${post.slug}/${post.image}`}
                  alt={post.title}
                  width={640}
                  height={480}
                  priority
                />
                <div
                  className="ribbon"
                  style={generateRibbonColors(post.tags[0])}
                >
                  {post.tags[0].toUpperCase()}
                </div>
              </Link>
              <section className="content">
                <h3>{post.title}</h3>
                <Tags tags={post.tags} />
                <p>{post.description}</p>
                <time dateTime={post.date}>
                  <i>{dateConverter(post.date)}</i>
                </time>
                <Link href={`/posts/${post.slug}`} className="button-read">
                  Read the article
                </Link>
              </section>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
