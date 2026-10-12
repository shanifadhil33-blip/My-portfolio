import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isInboxOwner } from "@/lib/inbox/owners";

/** The portfolio's own Google sign in for /inbox. It never uses another app's session.
 *  The picker shows on every sign in; only the allowed account gets a session. */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ authorization: { params: { prompt: "select_account" } } })],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/inbox", error: "/inbox" },
  callbacks: {
    // Refuse anyone else before a session exists, and show them the private page.
    signIn: ({ profile }) => (profile?.email_verified && isInboxOwner(profile.email) ? true : "/inbox?denied=1"),
    jwt: ({ token, profile }) => { if (profile?.email) token.email = profile.email.toLowerCase(); return token; },
    session: ({ session, token }) => { if (session.user) session.user.email = String(token.email ?? ""); return session; },
  },
});
