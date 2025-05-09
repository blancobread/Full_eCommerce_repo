import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/auth';
import UploadGarland from '../components/UploadGarland';
import GarlandCard from '../components/GarlandCard';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
} from '@hello-pangea/dnd';
import { Garland, GarlandCategory } from '../types/types';

const garlandCategories: GarlandCategory[] = [
  'Birthday',
  'Graduation',
  'Baby Shower',
  'Corporate',
  'Special Moments',
  'Holidays',
  'Other',
];

export default function AdminDashboard() {
  const [garlands, setGarlands] = useState<Garland[]>([]);
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

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    api.get<Garland[]>('/garlands').then((res) => {
      const withCategories = res.data.map((g) => ({
        ...g,
        category: g.category ?? 'Other',
      }));

      setGarlands(withCategories);
      groupByCategory(withCategories);
    });
  }, []);

  const groupByCategory = (garlands: Garland[]) => {
    const grouped: Record<GarlandCategory, Garland[]> = {
      Birthday: [],
      Graduation: [],
      'Baby Shower': [],
      Corporate: [],
      'Special Moments': [],
      Holidays: [],
      Other: [],
    };

    garlands.forEach((g) => {
      grouped[g.category].push(g);
    });

    setCategories(grouped);
  };

  const onUploaded = (garland: Garland) => {
    const updated = [...garlands, garland];
    setGarlands(updated);
    groupByCategory(updated);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceCategory = result.source.droppableId as GarlandCategory;
    const destCategory = result.destination.droppableId as GarlandCategory;

    if (
      sourceCategory === destCategory &&
      result.source.index === result.destination.index
    )
      return;

    const sourceItems = [...categories[sourceCategory]];
    const [moved] = sourceItems.splice(result.source.index, 1);
    moved.category = destCategory;

    const destItems = [...categories[destCategory]];
    destItems.splice(result.destination.index, 0, moved);

    const newCategories: Record<GarlandCategory, Garland[]> = {
      ...categories,
      [sourceCategory]: sourceItems,
      [destCategory]: destItems,
    };

    setCategories(newCategories);

    try {
      await api.post(`/garlands/${moved._id}/category`, {
        category: destCategory,
      });
    } catch (err) {
      console.error('Failed to update category', err);
      alert('Failed to save garland category. Please try again.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <div className="text-black">
        <UploadGarland onUploaded={onUploaded} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6">
          {garlandCategories.map((cat) => (
            <Droppable key={cat} droppableId={cat} type="garland">
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded shadow p-4"
                >
                  <h2 className="font-bold text-black mb-2">{cat}</h2>
                  <div className="space-y-2">
                    {categories[cat].map((garland, index) => (
                      <Draggable
                        key={garland._id}
                        draggableId={garland._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <GarlandCard garland={garland} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
