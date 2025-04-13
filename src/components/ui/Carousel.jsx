import { useState, useEffect, useCallback } from "react";
import { cn } from "../../utils/classNames";
import { PiCaretLeft } from "react-icons/pi";

export default function Carousel({ items, reverse = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, items.length]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, items.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, goToNext]);

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, currentIndex]
  );

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div
                className={`flex flex-col lg:flex-row items-center gap-8 p-4 ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center shadow-cardShadow">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                  <div
                    className={cn(
                      "p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6",
                      item.color
                    )}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className={cn(
                      "font-header text-3xl font-bold mb-4",
                      item.textColor
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="font-sans text-lg text-neutral-darkCharcoal mb-6">
                    {item.description}
                  </p>
                  <button
                    className={cn(
                      "mt-4 px-6 py-3 rounded-md font-medium",
                      index === 0
                        ? "bg-primary-vividBlue hover:bg-primary-vividBlueHover text-white"
                        : index === 1
                        ? "bg-secondary-mutedPurple hover:bg-secondary-mutedPurple/90 text-white"
                        : "bg-primary-energeticYellow hover:bg-primary-energeticYellowHover text-neutral-darkCharcoal"
                    )}
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Previous slide"
      >
        <PiCaretLeft className="h-6 w-6 text-neutral-darkCharcoal" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
        aria-label="Next slide"
      >
        <PiCaretLeft className="h-6 w-6 text-neutral-darkCharcoal rotate-180" />
      </button>

      <div className="flex justify-center mt-8 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentIndex === index
                ? "bg-primary-vividBlue w-8"
                : "bg-neutral-mediumGray hover:bg-neutral-mediumGray/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
