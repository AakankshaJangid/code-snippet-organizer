import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/"); // if already logged in, redirect home
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={() => signIn("github")} // or google/email depending on provider
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}