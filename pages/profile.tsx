import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <p className="p-4">Loading...</p>;
  if (!session)
    return <p className="p-4">You must be logged in to view this page.</p>;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (res.ok) {
        await update(); // refresh session
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Edit Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <Image
          src={image || "/default-avatar.png"}
          alt="User Avatar"
          width={96} // w-24 = 96px
          height={96} // h-24 = 96px
          className="rounded-full mx-auto mb-4"
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full px-3 py-2 mb-3"
          placeholder="Your name"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
