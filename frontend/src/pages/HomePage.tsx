import { useEffect, useState } from 'react';
import api from '../api/api';
import { Garland, GarlandCategory } from '../types/types';
import Carousel from '../components/Carousel';

const garlandCategories: GarlandCategory[] = [
  'Birthday',
  'Graduation',
  'Baby Shower',
  'Corporate',
  'Special Moments',
  'Holidays',
  'Other',
];

export default function HomePage() {
  const [categories, setCategories] = useState<
    Record<GarlandCategory, Garland[]>
  >({
    Birthday: [],
    Graduation: [],
    'Baby Shower': [],
    Corporate: [],
    'Special Moments': [],
    Holidays: [],
    Other: [],
  });

  useEffect(() => {
    api.get<Garland[]>('/garlands').then((res) => {
      const grouped: typeof categories = {
        Birthday: [],
        Graduation: [],
        'Baby Shower': [],
        Corporate: [],
        'Special Moments': [],
        Holidays: [],
        Other: [],
      };

      res.data.forEach((g) => {
        grouped[g.category || 'Other'].push(g);
      });

      setCategories(grouped);
    });
  }, []);

  return (
    <div className="space-y-6 p-4">
      {garlandCategories.map((category) =>
        categories[category].length ? (
          <div key={category}>
            <h2 className="text-xl font-bold mb-2">{category}</h2>
            <Carousel items={categories[category]} />
          </div>
        ) : null,
      )}
    </div>
  );
}
