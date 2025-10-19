// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import ScrollReveal from "scrollreveal";

/* Images */
import headerImg from "../assets/imgs/header-1.jpg";
import about1 from "../assets/imgs/about-1.jpg";
import about2 from "../assets/imgs/about-2.jpg";
import about3 from "../assets/imgs/about-3.jpg";

/* Landing page CSS (hero ::before + about gradient + layout) */
import "../styles/landing.css";

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

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

  return (
    <div className="relative min-h-screen text-white bg-primary">
      {/* HEADER with custom property used by CSS ::before */}
      <header
        id="home"
        className="header"
        style={
          {
            ["--header-image" as any]: `url(${headerImg})`,
          } as React.CSSProperties
        }
      >
        {/* NAVBAR */}
        <nav className="relative max-w-[1200px] mx-auto p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <a href="#home" className="text-white font-header text-xl font-semibold">
                Reflectra
              </a>
            </div>

            <ul className="hidden md:flex items-center gap-8">
              <li><a href="#about" className="hover:text-secondary font-medium">About Us</a></li>
              <li><a href="#equipment" className="hover:text-secondary font-medium">Equipment</a></li>
              <li><a href="#blog" className="hover:text-secondary font-medium">Blog</a></li>
            </ul>

            <div className="hidden md:flex flex-1 justify-end">
              <Link to="/login" className="bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center gap-2" aria-label="Account">
                <span><i className="ri-user-line" /></span> Account
              </Link>
            </div>

            {/* Mobile menu */}
            <button
              aria-label="Toggle menu"
              className="md:hidden text-white text-2xl"
              onClick={() => setIsOpen((v) => !v)}
              id="menu-btn"
            >
              <i className={clsx(isOpen ? "ri-close-line" : "ri-menu-line")} />
            </button>
          </div>

          {/* Mobile dropdown */}
          <ul
            id="nav-links"
            className={clsx(
              "md:hidden absolute right-4 top-[68px] w-[calc(100%-2rem)] max-w-[350px] p-8 rounded-lg flex flex-col items-center justify-center gap-6 bg-primary/80 transition-opacity duration-300",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={closeMenu}
          >
            <li><a href="#about" className="hover:text-secondary font-medium">About Us</a></li>
            <li><a href="#equipment" className="hover:text-secondary font-medium">Equipment</a></li>
            <li><a href="#blog" className="hover:text-secondary font-medium">Blog</a></li>
            <li className="w-full pt-2 border-t border-white/10">
              <Link to="/login" className="w-full bg-transparent hover:bg-white/10 transition rounded px-4 py-2 inline-flex items-center justify-center gap-2" aria-label="Account">
                <span><i className="ri-user-line" /></span> Account
              </Link>
            </li>
          </ul>
        </nav>

        {/* HERO CONTENT */}
        <div className="section__container header__container">
          <div className="header__content text-center">
            <h3 className="section__subheader">A HIKING GUIDE</h3>
            <h1 className="section__header">Be Prepared For The Mountains And Beyond!</h1>
            <div className="scroll__btn mt-6">
              <a href="#about" className="inline-flex items-center gap-2 hover:text-secondary">
                Scroll down <span><i className="ri-arrow-down-line" /></span>
              </a>
            </div>
          </div>

          {/* Rotated socials on md+ */}
          <div className="header__socials hidden md:flex">
            <span className="-rotate-90">Follow us</span>
            <a href="#" className="-rotate-90 hover:text-secondary"><i className="ri-instagram-line" /></a>
            <a href="#" className="-rotate-90 hover:text-secondary"><i className="ri-twitter-fill" /></a>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="section__container about__container md:gap-y-40">
          {/* Row 1: image right, content left */}
          <div className="about__image about__image-1"><img src={about1} alt="about" /></div>
          <div className="about__content about__content-1 md:ml-24">
            <h3 className="section__subheader">GET STARTED</h3>
            <h2 className="section__header">What level of hiker are you?</h2>
            <p className="text-textlight max-w-[60ch]">
              Whether you're a novice seeking scenic strolls or an experienced trekker
              craving challenging ascents, we've curated a diverse range of trails to cater
              to every adventurer. Uncover your hiking identity, explore tailored
              recommendations, and embrace the great outdoors with a newfound understanding
              of your capabilities.
            </p>
            <div className="about__btn">
              <a href="#" className="inline-flex items-center gap-2 text-[#e9c675]">Read more <span>→</span></a>
            </div>
          </div>

          {/* Row 2 */}
          <div className="about__image about__image-2" id="equipment"><img src={about2} alt="about" /></div>
          <div className="about__content about__content-2 md:ml-24">
            <h3 className="section__subheader">HIKING ESSENTIALS</h3>
            <h2 className="section__header">Picking the right hiking gear!</h2>
            <p className="text-textlight max-w-[60ch]">
              From durable footwear that conquers rugged trails to lightweight backpacks that
              carry your essentials with ease, we navigate the intricacies of gear selection
              to ensure you're geared up for success on every hike. Lace up your boots and
              let the journey begin with confidence, knowing you've chosen the right gear
              for the trail ahead!
            </p>
            <div className="about__btn">
              <a href="#" className="inline-flex items-center gap-2 text-[#e9c675]">Read more <span>→</span></a>
            </div>
          </div>

          {/* Row 3 */}
          <div className="about__image about__image-3" id="blog"><img src={about3} alt="about" /></div>
          <div className="about__content about__content-3 md:ml-24">
            <h3 className="section__subheader">WHERE YOU GO IS THE KEY</h3>
            <h2 className="section__header">Understanding your map &amp; timing</h2>
            <p className="text-textlight max-w-[60ch]">
              Knowing when to start and anticipating the changing conditions ensures a safe
              and enjoyable journey. So, dive into the details, grasp the contours, and
              synchronize your steps with the rhythm of nature. It's not just a hike; it's
              a journey orchestrated by your map and timed to perfection.
            </p>
            <div className="about__btn">
              <a href="#" className="inline-flex items-center gap-2 text-[#e9c675]">Read more <span>→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary">
        <div className="section__container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-[300px]">
            <div className="mb-4"><a href="#home" className="text-white font-header text-xl font-semibold">Reflectra</a></div>
            <p className="text-textlight">Get out there and discover your next slope, mountains, and destination.</p>
          </div>
          <div>
            <h4 className="mb-4 text-secondary text-base font-semibold">More on The Blog</h4>
            <ul className="grid gap-3">
              <li><a href="#" className="text-textlight hover:text-secondary">About Reflectra</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Contributors & Writers</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Write For Us</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Contact Us</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-secondary text-base font-semibold">More on Reflectra</h4>
            <ul className="grid gap-3">
              <li><a href="#" className="text-textlight hover:text-secondary">The Team</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Jobs</a></li>
              <li><a href="#" className="text-textlight hover:text-secondary">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="py-4 text-center text-textlight text-sm">Copyright © 2024 Reflectra. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
