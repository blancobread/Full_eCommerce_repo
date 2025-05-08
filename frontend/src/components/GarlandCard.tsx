interface Props {
  garland: { imageUrl: string; category: string };
}

export default function GarlandCard({ garland }: Props) {
  return (
    <div className="border p-2 rounded  bg-gray-100">
      <img
        src={garland.imageUrl}
        alt=""
        className="w-full h-32 object-cover rounded mb-2"
      />
      <p className="text-sm text-gray-600">{garland.category}</p>
    </div>
  );
}
