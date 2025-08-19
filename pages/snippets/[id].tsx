import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SnippetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/api/snippets/${id}` : null, fetcher);
  const [loading, setLoading] = useState(false);

  if (error) return <p>❌ Failed to load</p>;
  if (!data) return <p>⏳ Loading...</p>;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    setLoading(true);
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.push("/snippets");
    else alert("❌ Failed to delete");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-600">{data.description}</p>
      <pre className="bg-gray-900 text-green-300 p-4 rounded mt-4 whitespace-pre-wrap">
        {data.code}
      </pre>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push(`/snippets/edit/${id}`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
}