import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditSnippet() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    tags: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/snippets/${id}`)
        .then((res) => res.json())
        .then((data) =>
          setForm({
            title: data.title,
            description: data.description,
            language: data.language,
            tags: data.tags.join(", "),
            code: data.code,
          })
        );
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/snippets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      }),
    });

    setLoading(false);
    if (res.ok) router.push(`/snippets/${id}`);
    else alert("❌ Failed to update snippet");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="w-full p-2 border rounded font-mono h-40"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Snippet"}
        </button>
      </form>
    </div>
  );
}