import { useEffect, useState } from "react";
import Link from "next/link";

interface Snippet {
  _id: string;
  title: string;
  description?: string;
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    async function fetchSnippets() {
      const res = await fetch("/api/snippets");
      const data = await res.json();
      setSnippets(data);
    }
    fetchSnippets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📑 Snippets</h1>
      <ul className="space-y-2">
        {snippets.map((snippet) => (
          <li key={snippet._id} className="p-3 border rounded bg-gray-50 hover:bg-gray-100">
            <Link href={`/snippets/${snippet._id}`}>
              <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
                {snippet.title}
              </span>
            </Link>
            {snippet.description && (
              <p className="text-gray-600 text-sm">{snippet.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}