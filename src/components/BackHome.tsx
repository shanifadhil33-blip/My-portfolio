import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackHome() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-foreground active:text-foreground"
    >
      <ArrowLeft size={16} aria-hidden />
      Home
    </Link>
  );
}
