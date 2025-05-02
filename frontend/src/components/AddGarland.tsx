import { useState } from "react";
import api from "../api/api";

interface Props {
  onAdded: () => void;
}

function AddGarland({ onAdded }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return alert("Please select image");

    // Upload image
    const formData = new FormData();
    formData.append("image", form.image);

    const uploadRes = await api.post("/upload", formData);
    const imageUrl = uploadRes.data.imageUrl;

    // Add garland
    await api.post("/garlands", {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      imageUrl,
    });

    alert("Garland added!");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Garland</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="price" type="number" step="0.01" placeholder="Price" onChange={handleChange} required />
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Add Garland</button>
    </form>
  );
}

export default AddGarland;