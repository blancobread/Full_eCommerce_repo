import { useState } from "react";
import api from "../api/api";
import { Order } from "../types/types";

function OrderForm() {
  const [form, setForm] = useState<Omit<Order, "_id" | "status" | "dateOrdered">>({
    customerName: "",
    address: "",
    garlandId: "",
    quantity: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post("/orders", {
      ...form,
      status: "pending",
      dateOrdered: new Date().toISOString().split('T')[0]
    }).then(() => alert("Order placed!"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Order Garland</h1>
      <input name="customerName" placeholder="Your Name" onChange={handleChange} required />
      <input name="address" placeholder="Your Address" onChange={handleChange} required />
      <input name="garlandId" placeholder="Garland ID" onChange={handleChange} required />
      <input name="quantity" type="number" min="1" onChange={handleChange} required />
      <button type="submit">Place Order</button>
    </form>
  );
}

export default OrderForm;