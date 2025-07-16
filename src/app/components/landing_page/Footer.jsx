import React from "react";
import FooterColumn from "./FooterColumn";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Integrations", href: "#" },
  { label: "Updates", href: "#" },
];
const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];
const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "GDPR Compliance", href: "#" },
];

const Footer = () => (
  <footer className="bg-white text-gray-700 pt-14 pb-6 px-4 md:px-16 border-t border-sky-200 max-w-7xl mx-auto">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
      {/* Left: Brand and tagline */}
      <div className="mb-10 md:mb-0 md:w-1/4">
        <div className="text-2xl font-extrabold text-sky-600 mb-2">
          CardSmart
        </div>
        <div className="text-gray-500 mb-4">
          The intelligent way to
          <br />
          organize your digital wallet.
        </div>
        <div className="flex gap-3 mt-2">
          <a href="#" aria-label="Twitter" className="hover:text-sky-600">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-400">
              <path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.93 8.93 0 0 1-2.83 1.08A4.48 4.48 0 0 0 11.1 9.03c0 .35.04.7.1 1.03A12.7 12.7 0 0 1 3.1 5.1a4.48 4.48 0 0 0 1.39 5.98c-.7-.02-1.36-.21-1.94-.53v.05a4.48 4.48 0 0 0 3.6 4.4c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.2 0-.39-.01-.58.88-.64 1.65-1.44 2.26-2.36z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-sky-600">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-400">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-sky-600">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-400">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.13 1.13a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-sky-600">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-400">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
          </a>
        </div>
      </div>
      {/* Columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
        <FooterColumn title="Product" links={productLinks} />
        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>
    </div>
    <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500 text-sm">
      &copy; 2023 CardSmart. All rights reserved.
    </div>
  </footer>
);

export default Footer;
