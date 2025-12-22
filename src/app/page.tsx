'use client';

import Image from "next/image";
import Link from "next/link";
import BeforeAfterSlider from "@/components/viewer/BeforeAfterSlider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useRef } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Nordic");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column */}
          <div className="space-y-8 lg:pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-neutral-600 tracking-wide">SPATIAL AI V2.0 LIVE</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-serif text-zinc-900 leading-[0.95] tracking-tight">
                Redefine
                <br />
                <span className="serif-italic font-light text-zinc-600">interiority.</span>
              </h1>
              <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-md">
                The definitive tool for architectural restyling. Preserve geometry, reimagine aesthetics.
              </p>
            </div>

            <div className="space-y-4 bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload area with icon button and URL input */}
              <div className="flex items-center gap-3 border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-neutral-400 transition">
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition"
                  aria-label="Upload image file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload..."
                  className="flex-1 bg-transparent text-sm text-neutral-600 placeholder:text-neutral-400 outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Style Preset</span>
                  <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">View all</Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedStyle("Modern")}
                    className={`px-4 py-2.5 text-sm rounded-lg transition ${selectedStyle === "Modern"
                      ? "bg-black text-white"
                      : "border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                  >
                    Modern
                  </button>
                  <button
                    onClick={() => setSelectedStyle("Nordic")}
                    className={`px-4 py-2.5 text-sm rounded-lg transition ${selectedStyle === "Nordic"
                      ? "bg-black text-white"
                      : "border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                  >
                    Nordic
                  </button>
                  <button
                    onClick={() => setSelectedStyle("Luxe")}
                    className={`px-4 py-2.5 text-sm rounded-lg transition ${selectedStyle === "Luxe"
                      ? "bg-black text-white"
                      : "border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                  >
                    Luxe
                  </button>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2">
                Generate Render
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-neutral-300 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-neutral-400 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-neutral-500 border-2 border-white" />
              </div>
              <span className="text-sm text-neutral-500">2k</span>
              <span className="text-sm text-neutral-400">Trusted by elite firms</span>
            </div>
          </div>

          {/* Right Column - Before/After Comparison */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white lg:mt-0">
            <BeforeAfterSlider
              beforeImage="https://ext.same-assets.com/896819420/1850330870.jpeg"
              afterImage="https://ext.same-assets.com/896819420/1090215329.jpeg"
              beforeLabel="ORIGINAL"
              afterLabel="RESTYLED"
            />
          </div>
        </div>
      </section>

      {/* Social Proof - Magazine Logos */}
      <section className="container mx-auto px-6 py-16 border-y border-neutral-200 bg-white">
        <p className="text-center text-xs text-neutral-400 uppercase tracking-widest mb-8">
          Powering the next generation of design
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          <span className="text-2xl font-serif italic text-neutral-400">Vogue Living</span>
          <span className="text-2xl text-neutral-600">Architectural Digest</span>
          <span className="text-2xl font-serif italic text-neutral-400">Dezeen</span>
          <span className="text-2xl text-neutral-600">Dwell</span>
          <span className="text-2xl font-serif italic text-neutral-400">Elle Decor</span>
        </div>
      </section>

      {/* Precision Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-serif leading-tight">
              Precision over hallucination.
              <span className="block w-16 h-1 bg-black mt-6" />
            </h2>
          </div>
          <div>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Most generative models distort the physical reality of a room. RealStyler respects geometry, lighting, and textures to deliver architectural fidelity.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl font-serif">Core Capabilities</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4 group cursor-pointer">
            <div className="w-12 h-12 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-transparent">
              <svg className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif group-hover:text-black transition-colors">Spatial Geometry</h3>
            <p className="text-neutral-600 leading-relaxed">
              Our model identifies walls, floors, and ceilings to ensure furniture placement is physically accurate within the 3D volume.
            </p>
          </div>

          <div className="space-y-4 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center border-2 border-transparent transition-all duration-300 rounded-lg group-hover:bg-black group-hover:text-white">
              <svg className="w-8 h-8 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif group-hover:text-black transition-colors">Adaptive Lighting</h3>
            <p className="text-neutral-600 leading-relaxed">
              Shadows and reflections are calculated based on the existing HDRI environment map extracted from your photograph.
            </p>
          </div>

          <div className="space-y-4 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center border-2 border-transparent transition-all duration-300 rounded-lg group-hover:bg-black group-hover:text-white">
              <svg className="w-8 h-8 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif group-hover:text-black transition-colors">Material Fidelity</h3>
            <p className="text-neutral-600 leading-relaxed">
              Retain specific elements like hardwood floors or window frames while changing only the soft furnishings.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="bg-white py-16 border-t border-neutral-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
              PORTFOLIO
            </p>
            <h2 className="text-4xl md:text-5xl font-serif">Generated with RealStyler</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Portrait image - Profile with orange goggles */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/profile_orange_goggles_1766406758143.png"
                alt="Portfolio 1"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
            {/* Landscape image - Living room interior */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/modern_living_room_1766406771698.png"
                alt="Portfolio 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
            {/* Portrait image - Yellow chair interior */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/yellow_chair_interior_1766406787652.png"
                alt="Portfolio 3"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="text-sm font-medium underline hover:text-neutral-600 transition-colors cursor-pointer">
              BROWSE FULL COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* Curated Aesthetics Carousel */}
      <section className="bg-neutral-900 text-white py-16 relative">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-2">Curated Aesthetics</h2>
              <p className="text-neutral-400">Select from our library of designer-tuned presets.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              {
                title: "Minimalist",
                desc: "CLEAN LINES · MONOCHROMATIC",
                img: "https://ext.same-assets.com/896819420/1368723245.jpeg"
              },
              {
                title: "Scandinavian",
                desc: "WARM WOODS · HYGGE",
                img: "https://ext.same-assets.com/896819420/560325481.jpeg"
              },
              {
                title: "Industrial Loft",
                desc: "RAW CONCRETE · METAL",
                img: "https://ext.same-assets.com/896819420/2140156860.jpeg"
              },
              {
                title: "Japandi",
                desc: "ZEN · BALANCE",
                img: "https://ext.same-assets.com/896819420/734994911.jpeg"
              },
              {
                title: "Mid-Century Modern",
                desc: "ORGANIC · RETRO",
                img: "https://ext.same-assets.com/896819420/1850330870.jpeg"
              }
            ].map((style, index) => (
              <div key={index} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={style.img}
                      alt={`${style.title} style`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif mb-1 group-hover:text-white transition-colors">{style.title}</h3>
                    <p className="text-sm text-neutral-400">{style.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-neutral-900 text-white rounded-3xl p-12 md:p-16 text-center max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Ready to sell the vision?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join 10,000+ interior designers and real estate agents using RealStyler to accelerate their workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-neutral-100 transition">
              Start for free
            </button>
            <button className="text-white px-8 py-3.5 rounded-full font-medium hover:text-neutral-300 transition flex items-center gap-2">
              Book a demo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
