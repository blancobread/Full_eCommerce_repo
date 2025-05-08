export type GarlandCategory =
  | 'Birthday'
  | 'Graduation'
  | 'Baby Shower'
  | 'Corporate'
  | 'Special Moments'
  | 'Holidays'
  | 'Other';

export interface Garland {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: GarlandCategory;
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

export interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export type FormData = {
  username: string;
  password: string;
};
