import Link from 'next/link';
import { inter } from './fonts';
import BtnBack from './ui/BtnBack';
import { GITHUB_URL } from './constants/paths';
import './not-found.css';

export default function NotFound() {
  return (
    <main id="not-found">
      <article className={inter.className}>
        <h1>Not Found</h1>
        <p>Oh no! This page doesn`t exist!</p>
        <p className="not-found-actions">
          <BtnBack /> |{' '}
          <Link href={`${GITHUB_URL}/issues`} className="link-issue">
            Create issue
          </Link>
        </p>
      </article>
    </main>
  );
}
