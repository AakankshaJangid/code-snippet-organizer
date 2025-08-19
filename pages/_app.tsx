import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/snippets">Snippets</Link>
      <Link href="/snippets/new">New Snippet</Link>
      <div>
        {session && (
          <Link href="/profile" className="font-semibold">
            Profile
          </Link>
        )}
      </div>
      <div className="ml-auto">
        {!session ? (
          <button
            onClick={() => signIn()}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
