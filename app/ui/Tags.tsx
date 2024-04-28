import './tags.css';

export default function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="tags">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
