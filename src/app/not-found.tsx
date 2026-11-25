import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-2xl font-bold">Nothing here</h1>
      <p className="mt-2 text-muted">That video or page isn&apos;t in DevTube.</p>
      <Link href="/" className="mt-6 rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg">
        Back home
      </Link>
    </div>
  );
}
