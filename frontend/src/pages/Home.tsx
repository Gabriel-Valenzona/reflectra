// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import ScrollReveal from "scrollreveal";

// Place these images at: /src/assets/header-1.jpg, about-1.jpg, about-2.jpg, about-3.jpg
import headerImg from "../assets/imgs/header-1.jpg";
import about1 from "../assets/imgs/about-1.jpg";
import about2 from "../assets/imgs/about-2.jpg";
import about3 from "../assets/imgs/about-3.jpg";

/**
 * Home landing page:
 * - Converts vanilla DOM operations to React state/effects
 * - Tailwind handles most styling; minimal CSS in global.css supports decorative ::before/::after
 */
const Home: React.FC = () => {
  // Mobile nav open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when a link is clicked (matching original "navLinks.addEventListener('click', ...)")
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    // Reproduce your ScrollReveal animation options from main.js
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom" as const,
      duration: 1000,
    };

    // Header reveals
    ScrollReveal().reveal(".header__container .section__subheader", {
      ...scrollRevealOption,
    });
    ScrollReveal().reveal(".header__container .section__header", {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(".header__container .scroll__btn", {
      ...scrollRevealOption,
      delay: 1000,
    });
    ScrollReveal().reveal(".header__container .header__socials", {
      ...scrollRevealOption,
      origin: "left",
      delay: 1500,
    });

    // About section reveals
    ScrollReveal().reveal(".about__image-1, .about__image-3", {
      ...scrollRevealOption,
      origin: "right",
    });
    ScrollReveal().reveal(".about__image-2", {
      ...scrollRevealOption,
      origin: "left",
    });
    ScrollReveal().reveal(".about__content .section__subheader", {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(".about__content .section__header", {
      ...scrollRevealOption,
      delay: 1000,
    });
    ScrollReveal().reveal(".about__content p", {
      ...scrollRevealOption,
      delay: 1500,
    });
    ScrollReveal().reveal(".about__content .about__btn", {
      ...scrollRevealOption,
      delay: 2000,
    });
  }, []);

  return (
    <div className="bg-primary text-white min-h-screen">
      {/* HEADER */}
      <header id="home" className="relative h-screen">
        {/* Background layer replicating header::before from vanilla CSS */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-full h-[calc(100%+15rem)] -z-10"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0), #0a1e27), url(${headerImg})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* NAVIGATION BAR */}
        <nav className="relative max-w-content mx-auto p-4 z-10">
          <div className="flex items-center justify-between">
            {/* Logo (left) */}
            <div className="flex-1">
              <a
                href="#home"
                className="text-white font-header text-xl font-semibold"
              >
                Reflectra
              </a>
            </div>

            {/* Center links (desktop) */}
            <ul className="hidden md:flex items-center gap-8">
              <li>
                <a href="#about" className="hover:text-secondary font-medium">
                  About Us
                </a>
              </li>
              <li>
                <a href="#equipment" className="hover:text-secondary font-medium">
                  Equipment
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-secondary font-medium">
                  Blog
                </a>
              </li>
            </ul>

            {/* Right actions (desktop) */}
            <div className="hidden md:flex flex-1 justify-end">
              {/* Account goes to /login in your router */}
              <Link
                to="/login"
                className="bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center gap-2"
                aria-label="Account"
              >
                <span>
                  <i className="ri-user-line" />
                </span>
                Account
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              className="md:hidden text-white text-2xl"
              onClick={() => setIsOpen((v) => !v)}
            >
              <i className={clsx(isOpen ? "ri-close-line" : "ri-menu-line")} />
            </button>
          </div>

          {/* Mobile dropdown: fades in/out; clicks close it */}
          <ul
            className={clsx(
              "md:hidden absolute right-4 top-[68px] w-[calc(100%-2rem)] max-w-[350px] p-8 rounded-lg flex flex-col items-center justify-center gap-6 bg-primary/80 transition-opacity duration-300",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={closeMenu}
          >
            <li>
              <a href="#about" className="hover:text-secondary font-medium">
                About Us
              </a>
            </li>
            <li>
              <a href="#equipment" className="hover:text-secondary font-medium">
                Equipment
              </a>
            </li>
            <li>
              <a href="#blog" className="hover:text-secondary font-medium">
                Blog
              </a>
            </li>
            <li className="w-full pt-2 border-t border-white/10">
              <Link
                to="/login"
                className="w-full bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center justify-center gap-2"
                aria-label="Account"
              >
                <span>
                  <i className="ri-user-line" />
                </span>
                Account
              </Link>
            </li>
          </ul>
        </nav>

        {/* HERO CONTENT */}
        <div className="section__container header__container relative isolate h-[calc(100%-75px)] flex items-center justify-center">
          <div className="header__content max-w-[700px] text-center">
            {/* Subheader with decorative line and watermark via CSS */}
            <h3 className="section__subheader mb-4 text-[0.9rem] font-semibold tracking-[2px] text-secondary">
              A HIKING GUIDE
            </h3>

            {/* Headline */}
            <h1 className="section__header mb-4 font-header text-5xl md:text-6xl font-semibold leading-tight">
              Be Prepared For The Mountains And Beyond!
            </h1>

            {/* Scroll button */}
            <div className="scroll__btn mt-6">
              <a
                href="#about"
                className="inline-flex items-center gap-2 hover:text-secondary"
              >
                Scroll down
                <span>
                  <i className="ri-arrow-down-line" />
                </span>
              </a>
            </div>
          </div>

          {/* Rotated socials on larger screens */}
          <div className="header__socials hidden md:flex absolute left-0 items-center gap-4 text-white -translate-x-[calc(50%-1rem)] rotate-90">
            <span className="-rotate-90">Follow us</span>
            <a href="#" className="-rotate-90 hover:text-secondary">
              <i className="ri-instagram-line" />
            </a>
            <a href="#" className="-rotate-90 hover:text-secondary">
              <i className="ri-twitter-fill" />
            </a>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="about bg-gradient-to-b from-transparent to-primary overflow-hidden"
      >
        <div className="section__container about__container grid gap-20 md:grid-cols-2 md:items-center">
          {/* Block 1: image right on desktop */}
          <div className="about__image about__image-1 md:col-start-2">
            <img
              src={about1}
              alt="Mountain landscape"
              className="max-w-[400px] mx-auto rounded shadow-[5px_5px_30px_rgba(0,0,0,0.4)]"
            />
          </div>
          <div className="about__content about__content-1 md:ml-24">
            <h3 className="section__subheader mb-4 text-[0.9rem] font-semibold tracking-[2px] text-secondary">
              GET STARTED
            </h3>
            <h2 className="section__header mb-4 font-header text-3xl text-white">
              What level of hiker are you?
            </h2>
            <p className="mb-6 text-textlight">
              Whether you're a novice seeking scenic strolls or an experienced
              trekker craving challenging ascents, we've curated a diverse range
              of trails to cater to every adventurer. Uncover your hiking
              identity, explore tailored recommendations, and embrace the great
              outdoors with a newfound understanding of your capabilities.
            </p>
            <div className="about__btn">
              <a href="#" className="group inline-flex items-center gap-2 text-secondary">
                Read more
                <span className="transition-transform group-hover:translate-x-2">
                  <i className="ri-arrow-right-line" />
                </span>
              </a>
            </div>
          </div>

          {/* Block 2 */}
          <div id="equipment" className="about__image about__image-2">
            <img
              src={about2}
              alt="Hiking gear"
              className="max-w-[400px] mx-auto rounded shadow-[5px_5px_30px_rgba(0,0,0,0.4)]"
            />
          </div>
          <div className="about__content about__content-2 md:ml-24">
            <h3 className="section__subheader mb-4 text-[0.9rem] font-semibold tracking-[2px] text-secondary">
              HIKING ESSENTIALS
            </h3>
            <h2 className="section__header mb-4 font-header text-3xl text-white">
              Picking the right hiking gear!
            </h2>
            <p className="mb-6 text-textlight">
              From durable footwear that conquers rugged trails to lightweight
              backpacks that carry your essentials with ease, we navigate the
              intricacies of gear selection to ensure you're geared up for success
              on every hike. Lace up your boots and let the journey begin with
              confidence, knowing you've chosen the right gear for the trail ahead.
            </p>
            <div className="about__btn">
              <a href="#" className="group inline-flex items-center gap-2 text-secondary">
                Read more
                <span className="transition-transform group-hover:translate-x-2">
                  <i className="ri-arrow-right-line" />
                </span>
              </a>
            </div>
          </div>

          {/* Block 3: image right on desktop */}
          <div id="blog" className="about__image about__image-3 md:col-start-2">
            <img
              src={about3}
              alt="Map and timing"
              className="max-w-[400px] mx-auto rounded shadow-[5px_5px_30px_rgba(0,0,0,0.4)]"
            />
          </div>
          <div className="about__content about__content-3 md:ml-24">
            <h3 className="section__subheader mb-4 text-[0.9rem] font-semibold tracking-[2px] text-secondary">
              WHERE YOU GO IS THE KEY
            </h3>
            <h2 className="section__header mb-4 font-header text-3xl text-white">
              Understanding your map & timing
            </h2>
            <p className="mb-6 text-textlight">
              Knowing when to start and anticipating the changing conditions ensures
              a safe and enjoyable journey. Dive into the details, grasp the contours,
              and synchronize your steps with the rhythm of nature.
            </p>
            <div className="about__btn">
              <a href="#" className="group inline-flex items-center gap-2 text-secondary">
                Read more
                <span className="transition-transform group-hover:translate-x-2">
                  <i className="ri-arrow-right-line" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer bg-primary">
        <div className="section__container footer__container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div className="footer__col max-w-[300px]">
            <div className="footer__logo mb-4">
              <a href="#home" className="text-white font-header text-xl font-semibold">
                Reflectra
              </a>
            </div>
            <p className="text-textlight">
              Get out there and discover your next slope, mountains, and destination.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="mb-4 text-secondary text-base font-semibold">
              More on The Blog
            </h4>
            <ul className="footer__links grid gap-3">
              <li><a href="#" className="text-textlight hover:text-secondary">About Reflectra</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Contributors & Writers</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Write For Us</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Contact Us</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="mb-4 text-secondary text-base font-semibold">
              More on Reflectra
            </h4>
            <ul className="footer__links grid gap-3">
              <li><a href="#" className="text-textlight hover:text-secondary">The Team</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Jobs</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bar py-4 text-center text-textlight text-sm">
          Copyright © 2024 Reflectra. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
