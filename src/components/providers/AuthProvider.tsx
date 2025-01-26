import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    );
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
      {children}
    </div>
  );
};
