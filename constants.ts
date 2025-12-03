import { Product, UserProfile, Order } from './types';

// Lista atualizada com lógica de Preços por Armazenamento
export const PRODUCTS: Product[] = [
  // iPhone 13
  {
    id: 'iphone-13',
    name: "iPhone 13",
    category: "iPhone",
    price: 2599.00,
    marketPrice: 4299.00,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=500&auto=format&fit=crop', 
    description: "Chip A15 Bionic. Sistema de câmera dupla. O melhor custo-benefício.",
    rating: 4.8,
    inStock: true,
    storageOptions: [
      { capacity: '128GB', price: 2599.00, marketPrice: 4299.00 },
      { capacity: '256GB', price: 3099.00, marketPrice: 4799.00 },
    ]
  },
  
  // iPhone 14
  {
    id: 'iphone-14',
    name: "iPhone 14",
    category: "iPhone",
    price: 2899.00,
    marketPrice: 4999.00,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=500&auto=format&fit=crop',
    description: "Bateria para o dia todo. Detecção de acidentes. Fotos em pouca luz aprimoradas.",
    rating: 4.9,
    inStock: true,
    storageOptions: [
      { capacity: '128GB', price: 2899.00, marketPrice: 4999.00 },
      { capacity: '256GB', price: 3399.00, marketPrice: 5499.00 },
    ]
  },

  // iPhone 15 (Consolidado)
  {
    id: 'iphone-15',
    name: "iPhone 15",
    category: "iPhone",
    price: 3499.00,
    marketPrice: 6499.00,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500&auto=format&fit=crop',
    description: "Dynamic Island. Câmera de 48MP. Design durável com vidro colorido.",
    rating: 5,
    inStock: true,
    storageOptions: [
      { capacity: '128GB', price: 3499.00, marketPrice: 6499.00 },
      { capacity: '256GB', price: 4299.00, marketPrice: 7299.00 },
      { capacity: '512GB', price: 5299.00, marketPrice: 8299.00 },
    ]
  },

  // iPhone 16 (Consolidado)
  {
    id: 'iphone-16',
    name: "iPhone 16",
    category: "iPhone",
    price: 4199.00,
    marketPrice: 7799.00,
    image: 'https://images.unsplash.com/photo-1726058694038-a25e9334bb94?q=80&w=500&auto=format&fit=crop',
    description: "Controle de Câmera. Botão de Ação. Inteligência Apple.",
    rating: 5,
    inStock: true,
    storageOptions: [
      { capacity: '128GB', price: 4199.00, marketPrice: 7799.00 },
      { capacity: '256GB', price: 4899.00, marketPrice: 8599.00 },
      { capacity: '512GB', price: 5899.00, marketPrice: 9599.00 },
    ]
  },

  // iPhone 17 (Conceito/Futuro)
  {
    id: 'iphone-17',
    name: "iPhone 17",
    category: "Lançamento",
    price: 5899.00,
    marketPrice: 9999.00,
    image: 'https://images.unsplash.com/photo-1695048132973-2e38c1a63c8c?q=80&w=500&auto=format&fit=crop',
    description: "Pré-venda Exclusiva de Natal. O futuro chegou primeiro na Icrazybr.",
    rating: 5,
    inStock: true,
    storageOptions: [
      { capacity: '256GB', price: 5899.00, marketPrice: 9999.00 },
      { capacity: '512GB', price: 6899.00, marketPrice: 10999.00 },
    ]
  },

  // iPhone 17 Pro
  {
    id: 'iphone-17-pro',
    name: "iPhone 17 Pro",
    category: "Lançamento",
    price: 7399.00,
    marketPrice: 11499.00,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=500&auto=format&fit=crop',
    description: "Acabamento Titânio. A melhor câmera já feita. Desempenho Pro.",
    rating: 5,
    inStock: true,
    storageOptions: [
      { capacity: '256GB', price: 7399.00, marketPrice: 11499.00 },
      { capacity: '512GB', price: 8399.00, marketPrice: 12499.00 },
      { capacity: '1TB', price: 9399.00, marketPrice: 14499.00 },
    ]
  },

  // iPhone 17 Pro Max
  {
    id: 'iphone-17-promax',
    name: "iPhone 17 Pro Max",
    category: "Lançamento",
    price: 8199.00,
    marketPrice: 12499.00,
    image: 'https://images.unsplash.com/photo-1695048133229-3079965d1341?q=80&w=500&auto=format&fit=crop',
    description: "Tela gigante. Bateria para 2 dias. A experiência definitiva em iPhone.",
    rating: 5,
    inStock: true,
    storageOptions: [
      { capacity: '256GB', price: 8199.00, marketPrice: 12499.00 },
      { capacity: '512GB', price: 9699.00, marketPrice: 15499.00 },
      { capacity: '1TB', price: 10699.00, marketPrice: 17499.00 },
    ]
  }
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Cliente Icrazybr',
  email: 'cliente@exemplo.com'
};

export const MOCK_ORDERS: Order[] = [
  {
    id: '9921',
    date: '2024-05-10',
    status: 'Delivered',
    currentStep: 4, // Finalizado
    total: 3499.00,
    paymentMethod: 'PIX',
    address: { line1: 'Rua 9, Setor Oeste', city: 'Goiânia - GO', zip: '74110-100' },
    items: [
      {
        id: 'iphone-13',
        name: "iPhone 13",
        category: "iPhone",
        price: 3499.00,
        description: "",
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=200&auto=format&fit=crop',
        quantity: 1,
        selectedStorage: '128GB'
      }
    ]
  },
  {
    id: '10234',
    date: '2024-06-05',
    status: 'In Transit',
    currentStep: 3, // Em Trânsito Internacional
    total: 8199.00,
    paymentMethod: 'Credit Card',
    address: { line1: 'Av. T-63, Bueno', city: 'Goiânia - GO', zip: '74230-010' },
    items: [
      {
        id: 'iphone-17-promax',
        name: "iPhone 17 Pro Max",
        category: "Lançamento",
        price: 8199.00,
        description: "",
        image: 'https://images.unsplash.com/photo-1695048133229-3079965d1341?q=80&w=200&auto=format&fit=crop',
        quantity: 1,
        selectedStorage: '256GB'
      }
    ]
  }
];