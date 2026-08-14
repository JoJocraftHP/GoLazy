"use client";

import SectionReveal from "./SectionReveal";
import MagneticButton from "./MagneticButton";
import { useDiscordStats } from "@/hooks/useDiscordStats";

export default function ContactSection() {
  const { memberCount, onlineCount } = useDiscordStats();

  return (
    <section id="contact" className="contact" aria-label="Contact information">
      <SectionReveal>
        <div className="contact__content">
          <header className="section__header">
            <span className="section__eyebrow">Connect</span>
            <h2 className="section__title section__title--gradient">
              Get in Touch
            </h2>
            <p className="section__subtitle">
              Join our community on Discord or follow us on X
            </p>
          </header>

          {/* Discord Widget */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <a
              href="https://discord.gg/UnhZDUH93X"
              target="_blank"
              rel="noopener noreferrer"
              className="discord-widget"
            >
              <span className="discord-widget__dot" aria-hidden="true" />
              <span>
                {onlineCount !== null ? (
                  <>
                    <span style={{ fontWeight: 700, color: "white" }}>
                      {onlineCount.toLocaleString("en-US")}
                    </span>{" "}
                    online
                    {memberCount !== null && (
                      <> · {memberCount.toLocaleString("en-US")} members</>
                    )}
                  </>
                ) : memberCount !== null ? (
                  <>
                    <span style={{ fontWeight: 700, color: "white" }}>
                      {memberCount.toLocaleString("en-US")}
                    </span>{" "}
                    members
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: 700, color: "white" }}>Join</span>{" "}
                    our Discord
                  </>
                )}
              </span>
            </a>
          </div>

          <div className="contact-buttons">
            <MagneticButton
              className="btn btn--primary btn--lg"
              href="https://discord.gg/UnhZDUH93X"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </MagneticButton>
            <MagneticButton
              className="btn btn--secondary btn--lg"
              href="https://x.com/GoLazyStudios"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow GoLazy on X (Twitter)"
            >
              Follow on X
            </MagneticButton>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
