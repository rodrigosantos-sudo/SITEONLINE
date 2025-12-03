export interface StorageOption {
  capacity: string;
  price: number;
  marketPrice: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  marketPrice?: number;
  description: string;
  image: string;
  rating?: number;
  inStock?: boolean;
  storageOptions?: StorageOption[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedStorage?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'In Transit';
  currentStep: number; // 1 to 4 representing the timeline step
  items: CartItem[];
  total: number;
  address: {
    line1: string;
    city: string;
    zip: string;
  };
  paymentMethod: string;
}

export type PageView = 'home' | 'product-details' | 'cart' | 'checkout' | 'login' | 'dashboard';