"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#games", label: "Our Games" },
  { href: "#about", label: "About Us" },
  { href: "#groups", label: "Groups" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPos = window.scrollY + 120;
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      let current = window.scrollY < 100 ? "hero" : "";

      sections.forEach((sec) => {
        if (
          scrollPos >= sec.offsetTop &&
          scrollPos < sec.offsetTop + sec.offsetHeight
        ) {
          current = sec.id;
        }
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navOpen) closeNav();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // Lock body scroll when nav open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  function closeNav() {
    setNavOpen(false);
  }

  function handleLinkClick(href: string) {
    closeNav();
    // smooth scroll (HTML already has scroll-behavior: smooth)
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      ref={headerRef}
      className={`header${scrolled ? " scrolled" : ""}`}
      role="banner"
    >
      <div className="header__container">
        {/* Logo */}
        <a
          href="#hero"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("#hero");
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
                    activeSection === link.href.slice(1) ? " active" : ""
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
