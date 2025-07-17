import React, { useState } from "react";

const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How it works", id: "howitworks" },
  { label: "Privacy", id: "privacy" },
  { label: "FAQ", id: "faq" },
];

import { useEffect } from "react";

const Navbar = ({ activeSection, setActiveSection, router }) => {
  const [showDesktopNav, setShowDesktopNav] = useState(false);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const handleIntersect = (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        // Pick the section closest to the top
        const sorted = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveSection(sorted[0].target.id);
      }
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-50px 0px -60% 0px",
      threshold: 0.3,
    });
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveSection]);
  return (
    <nav className="fixed w-full z-50 flex justify-between items-center p-0.5 md:p-1 bg-white shadow-md backdrop-blur min-h-[60px]">
      <div className="text-base md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 drop-shadow px-4">
        CardSmart
      </div>
      <div className="flex gap-2 items-center">
        {/* Desktop Nav Items */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`px-4 py-2 rounded focus:outline-none transition border-b-2 ${
                activeSection === item.id
                  ? "text-sky-600 border-sky-600 font-bold bg-sky-50"
                  : "text-gray-700 border-transparent hover:text-indigo-600"
              }`}
              onClick={() => {
                setActiveSection(item.id);
                document
                  .getElementById(item.id)
                  .scrollIntoView({ behavior: "smooth" });
              }}>
              {item.label}
            </button>
          ))}
          <button
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg bg-white hover:bg-indigo-50 transition currsor-pointer"
            onClick={() => router.push("/login")}>
            Login
          </button>
        </div>
        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 shadow mx-4"
            onClick={() => setShowDesktopNav((prev) => !prev)}>
            <span className="text-xl">&#9776;</span>
          </button>
        </div>
      </div>
      {showDesktopNav && (
        <div className="flex flex-col items-start gap-2 bg-white p-4 rounded-lg shadow-lg absolute top-12 right-4 z-50 w-48">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left px-4 py-2 rounded focus:outline-none transition border-l-4 ${
                activeSection === item.id
                  ? "text-sky-600 border-sky-600 font-bold bg-sky-50"
                  : "text-gray-700 border-transparent hover:text-indigo-600"
              }`}
              onClick={() => {
                setActiveSection(item.id);
                document
                  .getElementById(item.id)
                  .scrollIntoView({ behavior: "smooth" });
                setShowDesktopNav(false);
              }}>
              {item.label}
            </button>
          ))}
          <button
            onClick={() => router.push("/login")}
            className="w-full text-left text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition mt-2">
            Get Started
          </button>
        </div>
      )}

      {/* Mobile Nav Content */}
      {showDesktopNav && (
        <div
          id="mobile-nav"
          className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-start pt-16 px-8 space-y-4 text-xl overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full text-left text-gray-700 hover:text-indigo-600 bg-transparent px-2 py-3 rounded focus:outline-none"
              onClick={() => {
                document
                  .getElementById(item.id)
                  .scrollIntoView({ behavior: "smooth" });
                setShowDesktopNav(false);
              }}>
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              router.push("/login");
              setShowDesktopNav(false);
            }}
            className="text-white bg-gradient-to-r from-indigo-600 to-purple-500 px-6 py-3 rounded-lg shadow hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-transform duration-200 focus:ring-2 focus:ring-purple-400">
            Login with Google
          </button>
          <button
            aria-label="Close navigation menu"
            className="absolute top-6 right-8 text-3xl text-gray-700"
            onClick={() => setShowDesktopNav(false)}>
            &times;
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
