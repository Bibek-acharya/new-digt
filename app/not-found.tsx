import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-[22px] text-center">
      <h1 className="text-7xl font-extrabold text-ink" style={{ background: "var(--gradient-text)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        404
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] bg-teal px-5 font-medium text-white transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal">
          Back to Home
        </Link>
        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-btn)] border border-teal-dark bg-transparent px-5 font-medium text-teal-dark transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal">
          Contact Us
        </Link>
      </div>
    </section>
  );
}
