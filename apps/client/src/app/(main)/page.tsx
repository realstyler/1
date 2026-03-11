"use client";

import Image from "next/image";
import Link from "next/link";
import BeforeAfterSlider from "@/components/viewer/BeforeAfterSlider";
import Footer from "@/components/layout/Footer";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { StoredPath } from "@/types";
import ScrapedImages from "@/components/main/ScrapedImages";
import useScrapeUrl from "@/hooks/useScrapeImages";
import { useUploadImages } from "@/images/images.hooks";
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import HeroUploadCard from "@/components/landing/HeroUploadCard";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [loadedImage, setLoadedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("Nordic");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    isScraping,
    scrapedImages,
    toggleSelect,
    resetScrapedImages,
    scrapeUrl,
  } = useScrapeUrl();
  const { mutate: uploadImages, isPending: isPendingUploading } =
    useUploadImages();

  const [inputError, setInputError] = useState(false);
  const router = useRouter();
  const { show: showError } = useErrorToastStore();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const handleGenerateRender = async () => {
    setInputError(false);

    if (!imageUrl) {
      setInputError(true);
      return;
    }

    try {
      if (loadedImage) {
        const fd = new FormData();
        fd.append("images", loadedImage);

        uploadImages(fd, {
          onSuccess: (data) => {
            const storage: StoredPath[] = data.map((r) => ({
              id: r.id,
              name: "image",
              path: r.path,
            }));

            sessionStorage.setItem("uploadedImages", JSON.stringify(storage));
            router.push("/upload");
          },
          onError: (error) => showError(error.message),
        });
      } else if (imageUrl) {
        await scrapeUrl(imageUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleContinue = () => {
    // Картинки вже завантажені на сервер модалкою, 
    // тому просто закриваємо її і переходимо далі
    resetScrapedImages();
    router.push("/upload");
  };

  const featuresList = [
    {
      title: "Spatial Geometry",
      desc: "Our model identifies walls, floors, and ceilings to ensure furniture placement is physically accurate within the 3D volume.",
      wrapperClass:
        "w-12 h-12 flex items-center justify-center border-2 border-transparent transition-all duration-300 rounded-2xl group-hover:bg-black group-hover:text-white",
      svgClass:
        "w-7 h-7 text-neutral-600 group-hover:text-white transition-colors duration-300",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          fill="none"
          d="M4,6 A2,2 0 0,1 6,4 M9,4 H10.5 M13.5,4 H15 M18,4 A2,2 0 0,1 20,6 M20,9 V10.5 M20,13.5 V15 M20,18 A2,2 0 0,1 18,20 M15,20 H13.5 M10.5,20 H9 M6,20 A2,2 0 0,1 4,18 M4,15 V13.5 M4,10.5 V9"
        />
      ),
    },
    {
      title: "Adaptive Lighting",
      desc: "Shadows and reflections are calculated based on the existing HDRI environment map extracted from your photograph.",
      wrapperClass:
        "w-12 h-12 flex items-center justify-center border-2 border-transparent transition-all duration-300 rounded-2xl group-hover:bg-black group-hover:text-white",
      svgClass:
        "w-7 h-7 text-neutral-600 group-hover:text-white transition-colors duration-300",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
    },
    {
      title: "Material Fidelity",
      desc: "Retain specific elements like hardwood floors or window frames while changing only the soft furnishings.",
      wrapperClass:
        "w-12 h-12 flex items-center justify-center border-2 border-transparent transition-all duration-300 rounded-2xl group-hover:bg-black group-hover:text-white",
      svgClass:
        "w-7 h-7 text-neutral-600 group-hover:text-white transition-colors duration-300",
      svgPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          fill="none"
          d="M12 3l-8 4 8 4 8-4-8-4z M4 11l8 4 8-4 M4 15l8 4 8-4"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ScrapedImages
        scrapedImages={scrapedImages}
        onSelectImg={toggleSelect}
        onCancel={resetScrapedImages}
        onSubmit={handleContinue}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-27.5 items-start">
          
          <div className="space-y-8 lg:pt-8 w-full max-w-md shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-neutral-100">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
              <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">
                SPATIAL AI V2.0 LIVE
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-serif text-zinc-900 leading-[0.95] tracking-tight">
                Redefine
                <br />
                <span className="serif-italic font-light text-zinc-600">
                  interiority.
                </span>
              </h1>
              <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-md">
                The definitive tool for architectural restyling. Preserve
                geometry, reimagine aesthetics.
              </p>
            </div>

            <HeroUploadCard
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              setLoadedImage={setLoadedImage}
              inputError={inputError}
              setInputError={setInputError}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              isScraping={isScraping}
              isUploading={false}
              isPendingUploading={isPendingUploading}
              onGenerateRender={handleGenerateRender}
            />

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-neutral-300 border-2 border-white relative z-0" />
                <div className="w-8 h-8 rounded-full bg-neutral-400 border-2 border-white relative z-10" />
                <div className="w-8 h-8 rounded-full bg-neutral-500 border-2 border-white relative z-0 flex items-center justify-center">
                  <span className="text-xs text-white">2k</span>
                </div>
              </div>
              <span className="text-xs font-mediu pl-2 text-neutral-400">
                Trusted by elite firms
              </span>
            </div>
          </div>

          <div className="relative w-full lg:max-w-137.5 xl:max-w-200 rounded-sm overflow-hidden shadow-2xl bg-white p-1.5 border border-gray-200 lg:mt-15">
            <BeforeAfterSlider
              beforeImage="/modern_living_room_1766406771698.png"
              afterImage="/yellow_chair_interior_1766406787652.png"
              beforeLabel="ORIGINAL"
              afterLabel="RESTYLED"
            />
          </div>
        </div>
      </section>

      {/* Social Proof - Magazine Logos */}
      <section className="px-6 py-13 border-y border-neutral-200 bg-white">
        <p className="text-center text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-8">
          Powering the next generation of design
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          <span className="text-xl font-serif font-bold italic text-neutral-500">
            Vogue Living
          </span>
          <span className="text-xl font-serif font-semibold text-neutral-500">
            Architectural Digest
          </span>
          <span className="text-xl font-serif font-bold italic text-neutral-500">
            Dezeen
          </span>
          <span className="text-xl font-serif font-semibold text-neutral-500">
            Dwell
          </span>
          <span className="text-xl font-serif font-bold italic text-neutral-500">
            Elle Decor
          </span>
        </div>
      </section>

      {/* Precision Section */}
      <section className="container mx-auto px-6 py-24 border-b border-neutral-200">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight -ml-4 lg:-ml-12">
              Precision over <br /> hallucination.
              <span className="block w-12 h-1 bg-black mt-6" />
            </h2>
          </div>
          <div className="lg:mt-16">
            <p className="text-lg text-neutral-800 font-extralight leading-relaxed">
              Most generative models distort the physical reality of a room.
              RealStyler respects geometry, lighting, and textures to deliver
              architectural fidelity.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16 mb-10">
        <div className="text-center mb-12">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl font-serif">Core Capabilities</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {featuresList.map((feature, index) => (
            <div key={index} className="space-y-4 group cursor-pointer">
              <div className={feature.wrapperClass}>
                <svg
                  className={feature.svgClass}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {feature.svgPath}
                </svg>
              </div>
              <h3 className="text-xl font-serif group-hover:text-black transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Aesthetics Carousel */}
      <section className="bg-[#18181b] text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-2">
              Curated Aesthetics
            </h2>
            <p className="text-neutral-400 text-sm font-light">
              Select from our library of designer-tuned presets.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black transition text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black transition text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-350 mx-auto px-6">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 md:gap-8 pb-6 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              {
                title: "Minimalist",
                desc: "CLEAN LINES · MONOCHROMATIC",
                img: "https://ext.same-assets.com/896819420/1368723245.jpeg",
              },
              {
                title: "Scandinavian",
                desc: "WARM WOODS · HYGGE",
                img: "https://ext.same-assets.com/896819420/560325481.jpeg",
              },
              {
                title: "Industrial Loft",
                desc: "RAW CONCRETE · METAL",
                img: "https://ext.same-assets.com/896819420/2140156860.jpeg",
              },
              {
                title: "Japandi",
                desc: "ZEN · BALANCE",
                img: "https://ext.same-assets.com/896819420/734994911.jpeg",
              },
              {
                title: "Mid-Century Modern",
                desc: "ORGANIC · RETRO",
                img: "https://ext.same-assets.com/896819420/1850330870.jpeg",
              },
            ].map((style, index) => (
              <div
                key={index}
                className="flex-none w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-21px)] lg:w-[calc(25%-24px)] snap-start group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="relative aspect-3/4 rounded-sm overflow-hidden">
                    <Image
                      src={style.img}
                      alt={`${style.title} style`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif mb-1 group-hover:text-white transition-colors">
                      {style.title}
                    </h3>
                    <p className="text-sm text-neutral-400">{style.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="bg-white py-16 border-t border-neutral-200"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
              PORTFOLIO
            </p>
            <h2 className="text-3xl md:text-4xl font-serif">
              Generated with RealStyler
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/profile_orange_goggles_1766406758143.png"
                alt="Portfolio 1"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
            <div className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/modern_living_room_1766406771698.png"
                alt="Portfolio 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
            <div className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/yellow_chair_interior_1766406787652.png"
                alt="Portfolio 3"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-semibold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="text-sm font-medium underline underline-offset-6 hover:text-neutral-600 transition-colors cursor-pointer">
              BROWSE FULL COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-54">
        <div className="bg-[#19191c] text-white rounded-4xl px-12 py-20 md:px-16 md:py-28 text-center max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-8">
            Ready to sell the vision?
          </h2>
          <p className="text-lg text-neutral-400 font-light mb-8 max-w-xl mx-auto">
            Join 10,000+ interior designers and real estate agents using
            RealStyler to accelerate their workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={"/upload"}
              className="bg-white text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-neutral-100 transition"
            >
              Start for free
            </Link>
            <button className="text-white px-8 py-4 rounded-full font-medium hover:text-neutral-300 transition flex items-center gap-2">
              Book a demo
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
