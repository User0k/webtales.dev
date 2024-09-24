import Link from 'next/link';
import './BtnBack.css';

export default function BtnBack() {
  return (
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
  );
}
