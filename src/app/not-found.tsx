import BackHome from "@/components/BackHome";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-xl">
        <BackHome />
        <h1 className="mt-6 text-balance text-3xl font-medium tracking-tight text-foreground">
          This page isn&apos;t here
        </h1>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted">
          The link may be old, or the page may have moved.
        </p>
      </div>
    </main>
  );
}
