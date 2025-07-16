import React from "react";

const HeroSection = () => (
  <section
    id="hero"
    className="relative grid md:grid-cols-2 gap-10 px-4 py-6 md:px-16 md:py-20 items-center bg-white min-h-[80vh]">
    {/* Left: Headline, subheadline, CTAs, avatars, rating */}
    <div className="flex flex-col justify-center items-start z-10">
      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-6 mt-13 text-gray-900">
        Your Cards,<span className="text-sky-600"> Intelligently</span>
        <br />
        <span className="text-sky-600">Organized</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
        CardSmart brings your digital wallet to life with context-aware card
        management that learns your habits and adapts to your needs.
      </p>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex -space-x-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user1"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="user2"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/men/65.jpg"
            alt="user3"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
        </div>
        <span className="flex items-center ml-4">
          <span className="flex items-center gap-1">
            <span className="text-yellow-400 text-xl leading-none">★</span>
            <span className="text-yellow-400 text-xl leading-none">★</span>
            <span className="text-yellow-400 text-xl leading-none">★</span>
            <span className="text-yellow-400 text-xl leading-none">★</span>
            <span className="text-yellow-400 text-xl leading-none">★</span>
          </span>
          <span className="ml-2 font-bold text-gray-800 text-base">4.9/5</span>
        </span>
        <span className="text-gray-500 text-base ml-2">
          from 2,000+ reviews
        </span>
      </div>
    </div>
    {/* Right: iPhone image with blue glow */}
    <div className="flex flex-col items-center justify-center relative w-full min-h-[260px] md:min-h-[340px]">
      <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-sky-200 blur-[100px] opacity-40"></div>
      <div className="flex justify-center items-end w-full h-full">
        <img
          src="/mobileImage.png"
          alt="iPhone Wallet with Cards"
          className="mx-auto w-[100px] md:w-[140px] lg:w-[170px] max-w-full rounded-[2.5rem] object-contain shadow-lg"
          style={{
            aspectRatio: "9/19",
            boxShadow: "0 8px 32px 0 rgba(0, 180, 255, 0.10)",
          }}
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
