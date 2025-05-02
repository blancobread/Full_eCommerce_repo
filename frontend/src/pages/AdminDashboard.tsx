import { useEffect, useState } from "react";
import api from "../api/api";
import { Garland } from "../types/types";
import AddGarland from "../components/AddGarland";

function AdminDashboard() {
  const [garlands, setGarlands] = useState<Garland[]>([]);

  useEffect(() => {
    api.get("/garlands")
      .then(res => setGarlands(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AddGarland onAdded={() => window.location.reload()} />
      <ul>
        {garlands.map(g => (
          <li key={g._id}>
            {g.name} - ${g.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;