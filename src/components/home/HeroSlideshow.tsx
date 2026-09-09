import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, CheckCircle2 } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badgeText: string;
  badgeType: 'sold' | 'buying' | 'deal';
  itemTitle: string;
  price: string;
  location: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'Just Sold',
    badgeType: 'sold',
    itemTitle: 'Vintage Denim Jacket',
    price: 'Rs. 2,400',
    location: 'Kathmandu, Thamel',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'Verified Tech',
    badgeType: 'deal',
    itemTitle: 'Fujifilm Classic Camera',
    price: 'Rs. 38,000',
    location: 'Lalitpur, Jhamsikhel',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'Offer Accepted',
    badgeType: 'buying',
    itemTitle: 'PlayStation 5 Console',
    price: 'Rs. 52,000',
    location: 'Pokhara, Lakeside',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'Local Handover',
    badgeType: 'deal',
    itemTitle: 'Clean Code + Tech Books',
    price: 'Rs. 1,200',
    location: 'Bhaktapur',
  }
];

export const HeroSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play interval (every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900 aspect-4/3 lg:aspect-5/4 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with smooth crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transition-transform duration-1000`}
        >
          <img
            src={slide.image}
            alt={slide.itemTitle}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Floating Interactive Live Marketplace Card (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl shadow-xl border border-white/40 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1b7a53]/10 text-[#1b7a53] flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1b7a53]/10 text-[#1b7a53]">
                {currentSlide.badgeText}
              </span>
              <span className="text-[11px] text-gray-500">• {currentSlide.location}</span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">{currentSlide.itemTitle}</p>
          </div>
        </div>

        <div className="text-right pl-2">
          <span className="text-xs text-gray-400 block font-medium">Agreed Price</span>
          <span className="text-base sm:text-lg font-extrabold text-[#1b7a53]">{currentSlide.price}</span>
        </div>
      </div>

      {/* Navigation Arrows (Visible on hover) */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};