import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type BlogPost = { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string; gradient: [string, string] };
type BlogTeaserProps = { posts: BlogPost[] };

const gradientMap: Record<string, string> = {
  teal: "var(--teal)",
  leaf: "var(--leaf)",
  navy: "var(--navy)",
  gold: "var(--gold)",
};

export function BlogTeaser({ posts }: BlogTeaserProps) {
  return (
    <section className="bg-paper py-16 text-ink">
      <Container>
        <SectionHeading eyebrow="Blog" title="Latest insights" align="center" />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => {
            const [from, to] = post.gradient;
            return (
              <article
                key={post.slug}
                className="group rounded-[var(--radius-card)] border border-line bg-white transition duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              >
                <div
                  className="aspect-[16/9] rounded-t-[var(--radius-card)]"
                  style={{ background: `linear-gradient(135deg, ${gradientMap[from] ?? from}, ${gradientMap[to] ?? to})` }}
                />
                <div className="p-[22px]">
                  <span className="inline-block rounded-full bg-chip-mint px-3 py-1 text-xs font-semibold text-teal-dark">
                    {post.category}
                  </span>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-ink">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-teal-dark">
                    Read more &rarr;
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
