"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "/games", label: "Our Games" },
  { href: "#about", label: "About Us" },
  { href: "#groups", label: "Groups" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // scrollY alone doesn't force layout, so this stays cheap
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-link tracking via IntersectionObserver — the previous version read
  // offsetTop/offsetHeight for every section on every scroll event, forcing a
  // layout pass per frame.
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );
    if (sections.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // DOM order wins, so the topmost visible section is the active one
        const current = sections.find((sec) => visible.has(sec.id));
        if (current) setActiveSection(current.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [pathname]);

  // Close mobile nav on Escape + restrict tab focus to inside the drawer
  useEffect(() => {
    if (!navOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const nav = document.getElementById("main-nav");
      if (!nav) return;
      const focusables = nav.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // Lock body scroll + mark non-nav content inert when drawer is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    const main = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    [main, footer].forEach((el) => {
      if (!el) return;
      if (navOpen) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
    return () => {
      document.body.style.overflow = "";
      [main, footer].forEach((el) => el?.removeAttribute("inert"));
    };
  }, [navOpen]);

  function closeNav() {
    setNavOpen(false);
  }

  function handleLinkClick(href: string) {
    closeNav();
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    // Hash link — navigate to home if not already there
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  }

  // Determine which link should be highlighted as active
  const activeLinkHref =
    pathname === "/games" ? "/games" : `#${activeSection}`;

  return (
    <header
      className={`header${scrolled ? " scrolled" : ""}`}
      role="banner"
    >
      <div className="header__container">
        {/* Logo */}
        <a
          href={pathname === "/" ? "#hero" : "/"}
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            if (pathname === "/") {
              handleLinkClick("#hero");
            } else {
              router.push("/");
            }
          }}
        >
          <Image
            src="/assets/branding/GoLazyBraindingMain.png"
            alt="GoLazy Studios"
            width={36}
            height={36}
            className="logo__image"
            priority
          />
          <span>GoLazy</span>
        </a>

        {/* Desktop Nav */}
        <nav
          id="main-nav"
          className={`nav${navOpen ? " active" : ""}`}
          aria-label="Main navigation"
        >
          <ul className="nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="nav__item">
                <a
                  href={link.href}
                  className={`nav__link${
                    activeLinkHref === link.href ? " active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          className={`hamburger${navOpen ? " is-active" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={navOpen}
          aria-controls="main-nav"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay */}
      {navOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
          aria-hidden="true"
          onClick={closeNav}
        />
      )}
    </header>
  );
}
