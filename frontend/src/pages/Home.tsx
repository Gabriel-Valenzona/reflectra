// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import ScrollReveal from "scrollreveal";

import headerImg from "../assets/imgs/header-1.jpg";
import about1 from "../assets/imgs/about-1.jpg";
import about2 from "../assets/imgs/about-2.jpg";
import about3 from "../assets/imgs/about-3.jpg";

import "../styles/landing.css";

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // --- subtle hero parallax/tilt variables ---
  const headerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const scrollRevealOption = { distance: "50px", origin: "bottom" as const, duration: 1000 };
    ScrollReveal().reveal(".header__container .section__subheader", { ...scrollRevealOption });
    ScrollReveal().reveal(".header__container .section__header", { ...scrollRevealOption, delay: 500 });
    ScrollReveal().reveal(".header__container .scroll__btn", { ...scrollRevealOption, delay: 1000 });
    ScrollReveal().reveal(".header__container .header__socials", { ...scrollRevealOption, origin: "left", delay: 1500 });

    ScrollReveal().reveal(".about__image-1, .about__image-3", { ...scrollRevealOption, origin: "right" });
    ScrollReveal().reveal(".about__image-2", { ...scrollRevealOption, origin: "left" });
    ScrollReveal().reveal(".about__content .section__subheader", { ...scrollRevealOption, delay: 500 });
    ScrollReveal().reveal(".about__content .section__header", { ...scrollRevealOption, delay: 1000 });
    ScrollReveal().reveal(".about__content p", { ...scrollRevealOption, delay: 1500 });
    ScrollReveal().reveal(".about__content .about__btn", { ...scrollRevealOption, delay: 2000 });
  }, []);

  // Mouse tilt for hero (no library; CSS variables)
  const onHeroMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion.current) return;
    const el = headerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0 .. 1
    const y = (e.clientY - rect.top) / rect.height;   // 0 .. 1
    const tiltX = (y - 0.5) * -6; // range ~ -3..3
    const tiltY = (x - 0.5) * 6;  // range ~ -3..3
    el.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    el.style.setProperty("--mouse-x", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--mouse-y", `${(y * 100).toFixed(2)}%`);
  };

  const onHeroMouseLeave = () => {
    const el = headerRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-y", `0deg`);
  };

  return (
    <div className="relative min-h-screen text-white bg-primary">
      <header
        ref={headerRef as any}
        id="home"
        className="header"
        style={
          {
            ["--header-image" as any]: `url(${headerImg})`,
            ["--tilt-x" as any]: "0deg",
            ["--tilt-y" as any]: "0deg",
          } as React.CSSProperties
        }
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
      >
        {/* decorative floating orbs */}
        <div className="header__orbs" aria-hidden="true">
          <span className="orb orb--1" />
          <span className="orb orb--2" />
          <span className="orb orb--3" />
        </div>

        {/* NAVBAR */}
        <nav className="relative max-w-[1200px] mx-auto p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <a href="#home" className="text-white font-header text-xl font-semibold">
                Reflectra
              </a>
            </div>

            <ul className="hidden md:flex items-center gap-8">
              <li><a href="#about" className="hover:text-secondary font-medium">About</a></li>
              <li><a href="#features" className="hover:text-secondary font-medium">Features</a></li>
              <li><a href="#analytics" className="hover:text-secondary font-medium">Analytics</a></li>
            </ul>

            <div className="hidden md:flex flex-1 justify-end">
              <Link
                to="/login"
                className="bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center gap-2"
                aria-label="Account"
              >
                <span><i className="ri-user-line" /></span> Account
              </Link>
            </div>

            <button
              aria-label="Toggle menu"
              className="md:hidden text-white text-2xl"
              onClick={() => setIsOpen((v) => !v)}
              id="menu-btn"
            >
              <i className={clsx(isOpen ? "ri-close-line" : "ri-menu-line")} />
            </button>
          </div>

          {/* MOBILE MENU */}
          <ul
            id="nav-links"
            className={clsx(
              "md:hidden absolute right-4 top-[68px] w-[calc(100%-2rem)] max-w-[350px] p-8 rounded-lg flex flex-col items-center justify-center gap-6 bg-primary/80 transition-opacity duration-300 backdrop-blur",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={closeMenu}
          >
            <li><a href="#about" className="hover:text-secondary font-medium">About</a></li>
            <li><a href="#features" className="hover:text-secondary font-medium">Features</a></li>
            <li><a href="#analytics" className="hover:text-secondary font-medium">Analytics</a></li>
            <li className="w-full pt-2 border-t border-white/10">
              <Link
                to="/login"
                className="w-full bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center justify-center gap-2"
                aria-label="Account"
              >
                <span><i className="ri-user-line" /></span> Account
              </Link>
            </li>
          </ul>
        </nav>

        {/* HERO CONTENT */}
        <div className="section__container header__container">
          <div className="header__content text-center hero-tilt">
            <h3 className="section__subheader shimmer">A REFLECTION TOOL FOR GROWTH</h3>

            <h1 className="section__header quote" aria-live="polite">
              <span className="quote__inner">“They who thinks their journey is over, is truly lost.”</span>
            </h1>

            <div className="scroll__btn mt-6">
              <a href="#about" className="inline-flex items-center gap-2 hover:text-secondary magnet" aria-label="Explore Reflectra">
                Explore Reflectra
                <span><i className="ri-arrow-down-line" /></span>
              </a>
            </div>
          </div>

          {/* SOCIALS */}
          <div className="header__socials hidden md:flex">
            <span className="-rotate-90">Follow us</span>
            <a href="#" aria-label="Instagram" className="-rotate-90 hover:text-secondary social-kite">
              <i className="ri-instagram-line" />
            </a>
            <a href="#" aria-label="X (formerly Twitter)" className="-rotate-90 hover:text-secondary social-kite">
              <i className="ri-twitter-x-fill" />
            </a>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section id="about" className="about">
        <div className="section__container about__container md:gap-y-40">
          {/* Row 1 */}
          <div className="about__image about__image-1"><img src={about1} alt="about" /></div>
          <div className="about__content about__content-1 md:ml-24">
            <h3 className="section__subheader">WHAT IS REFLECTRA?</h3>
            <h2 className="section__header">“Reflectra” for your mental well-being.</h2>
            <p className="text-textlight max-w-[60ch]">
              Reflectra turns your mental health and productivity journey into a measurable,
              motivating experience. Capture your thoughts, track your moods, and reflect on
              why you started. Every action and emotion contributes to your long-term growth.
            </p>
            <div className="about__btn">
              <a href="#features" className="inline-flex items-center gap-2 text-[#e9c675]">
                Learn more <span>→</span>
              </a>
            </div>
          </div>

          {/* Row 2 */}
          <div className="about__image about__image-2" id="features"><img src={about2} alt="about" /></div>
          <div className="about__content about__content-2 md:ml-24">
            <h3 className="section__subheader">OUR FEATURES</h3>
            <h2 className="section__header">Personalized reflections powered by your own data.</h2>
            <p className="text-textlight max-w-[60ch]">
              Build your “reminder bank” — messages, quotes, and photos you’ve written to your
              future self. When Reflectra detects you’re feeling low, it emails or notifies you
              with those reminders, reconnecting you to your “why.”  
              <br /><br />
              Stay consistent with integrated tools:
              To-Do Lists, Goal Trackers with rewarding visual feedback, and dependency systems
              that let trusted friends check in on your progress.
            </p>
            <div className="about__btn">
              <a href="#analytics" className="inline-flex items-center gap-2 text-[#e9c675]">
                See how it works <span>→</span>
              </a>
            </div>
          </div>

          {/* Row 3 */}
          <div className="about__image about__image-3" id="analytics"><img src={about3} alt="about" /></div>
          <div className="about__content about__content-3 md:ml-24">
            <h3 className="section__subheader">ANALYTICS & AI INSIGHTS</h3>
            <h2 className="section__header">Understand your emotions. Visualize your growth.</h2>
            <p className="text-textlight max-w-[60ch]">
              Reflectra’s analytics dashboard lets you track how your mood, habits, and
              productivity evolve over time. Rate your week, take daily AI-powered mood and
              personality quizzes, and receive actionable insights on how to improve balance
              in your routines.  
              <br /><br />
              Every reflection, reminder, and connection builds a deeper understanding of
              yourself — because personal growth isn’t a race, it’s a reflection.
            </p>
            <div className="about__btn">
              <a href="#home" className="inline-flex items-center gap-2 text-[#e9c675]">
                Start reflecting <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary">
        <div className="section__container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-[300px]">
            <div className="mb-4">
              <a href="#home" className="text-white font-header text-xl font-semibold">
                Reflectra
              </a>
            </div>
            <p className="text-textlight">
              Reflectra is your companion for mindful productivity — combining reflection,
              accountability, and data-driven growth to help you rediscover your purpose.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-secondary text-base font-semibold">Explore</h4>
            <ul className="grid gap-3">
              <li><a href="#about" className="text-textlight hover:text-secondary">About</a></li>
              <li><a href="#features" className="text-textlight hover:text-secondary">Features</a></li>
              <li><a href="#analytics" className="text-textlight hover:text-secondary">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-secondary text-base font-semibold">Connect</h4>
            <ul className="grid gap-3">
              <li><a href="#" className="text-textlight hover:text-secondary">Community</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Contact</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="py-4 text-center text-textlight text-sm">
          © {new Date().getFullYear()} Reflectra — Built for those still growing.
        </div>
      </footer>
    </div>
  );
};

export default Home;
