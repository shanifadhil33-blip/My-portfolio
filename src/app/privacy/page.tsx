import type { Metadata } from "next";
import BackHome from "@/components/BackHome";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "What this site stores and how to have it deleted." };
export const dynamic = "force-static";

const H = "mt-8 text-lg font-medium text-foreground";
const P = "mt-2 text-muted leading-relaxed";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      <BackHome />
      <h1 className="mt-6 text-3xl font-medium tracking-tight text-foreground">Privacy</h1>
      <p className="mt-1 text-sm text-muted">Last updated 12 October 2026</p>
      <p className={P}>This is Adhil Shanif’s personal portfolio site. It keeps as little as it can.</p>

      <h2 className={H}>Visiting the site</h2>
      <p className={P}>Reading the site stores nothing about you. There are no advertising or tracking cookies.</p>

      <h2 className={H}>The project brief form</h2>
      <p className={P}>If you send a brief, what you type and any file you attach are emailed to Adhil through Resend, an email service. They are not kept on this site. Your internet address is held in memory for a short time only, to stop spam, and is never saved.</p>

      <h2 className={H}>The inbox sign in</h2>
      <p className={P}>The private inbox at /inbox uses Google sign in. Only Adhil’s own account is let in. When he signs in, a cookie keeps him signed in for up to 7 days, and Sign out removes it. If anyone else tries, Google tells us their email so we can check it, we refuse them, and we store nothing about them.</p>

      <h2 className={H}>Feedback from Adhil’s apps</h2>
      <p className={P}>People who use Adhil’s apps (such as Groundwork) can send feedback from the app’s Help tab. The inbox stores the message, which app and page it came from, the person’s role, a short device line (for example “Android phone, Chrome”), an optional screenshot, and a random code instead of their name, so repeat spam can be slowed down. It does not store their name or email. Only Adhil can read it. It is kept in a Neon database and never sold or shared.</p>

      <h2 className={H}>Deleting your data</h2>
      <p className={P}>To have a brief or a piece of feedback deleted, email <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a> and it will be done within 30 days.</p>
    </main>
  );
}
