import SectionReveal from "./SectionReveal";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="section"
      aria-label="About GoLazy Studios"
    >
      <SectionReveal>
        <header className="section__header">
          <span className="section__eyebrow">Our Story</span>
          <h2 className="section__title section__title--gradient">About Us</h2>
        </header>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="about__content">
          <p className="about__text">
            GoLazy is the{" "}
            <span className="about__highlight">
              parent brand of LazyGames and ActiveGames
            </span>
            . We specialize in high-rated, innovative titles that define the
            platform. Our studio was founded in 2023 by developers active since
            2017.
          </p>
          <p className="about__text">
            We&apos;re best known for our{" "}
            <span className="about__highlight">simulator games</span>, but
            we&apos;re expanding into new genres with fresh ideas. From concept
            to launch, we focus on creating fun, high-quality experiences for
            players worldwide.
          </p>
        </div>
      </SectionReveal>
    </section>
  );
}
