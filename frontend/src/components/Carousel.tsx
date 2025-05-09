import { useEffect, useRef, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { Garland } from '../types/types';

export default function Carousel({ items }: { items: Garland[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState(1.2);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: slidesPerView, spacing: 8 },
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // Adjust slides based on width
      if (width < 400) {
        setSlidesPerView(1.2);
      } else if (width < 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div ref={sliderRef} className="keen-slider">
        {items.map((garland) => (
          <div key={garland._id} className="keen-slider__slide px-2">
            <img
              src={`${API_URL}${garland.imageUrl}`}
              alt={garland.name}
              className="rounded w-full h-40 object-cover"
            />
            <p className="text-sm mt-1">{garland.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
