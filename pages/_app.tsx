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

      <div className="ml-auto">
        {session ? (
          <>
            <span className="mr-4">Hi, {session.user?.name}</span>
            <button onClick={() => signOut()}>Logout</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}