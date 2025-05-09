import { Garland } from '../types/types';

interface Props {
  garland: Garland;
}

export default function GarlandCard({ garland }: Props) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  console.log(garland.imageUrl);
  return (
    <div className="border p-2 rounded  bg-gray-100">
      <img
        src={`${API_URL}${garland.imageUrl}`}
        alt="Garland"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.png'; // 👈 fallback
        }}
        className="w-50 h-30 object-cover rounded mb-2"
      />
      <p className="text-sm text-gray-600">{garland.category}</p>
    </div>
  );
}
