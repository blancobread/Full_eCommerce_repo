import { useEffect, useState } from "react";
import api from "../api/api";
import { Garland } from "../types/types";

function GarlandList() {
  const [garlands, setGarlands] = useState<Garland[]>([]);

  useEffect(() => {
    api.get<Garland[]>("/garlands")
      .then(res => setGarlands(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Available Garlands</h1>
      <ul>
        {garlands.map(g => (
          <li key={g._id}>
            <strong>{g.name}</strong> - {g.description} (${g.price})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GarlandList;