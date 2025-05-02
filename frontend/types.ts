export interface Garland {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }
  
  export interface Order {
    _id?: string;
    customerName: string;
    address: string;
    garlandId: string;
    quantity: number;
    status?: string;
    dateOrdered?: string;
  }