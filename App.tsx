import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { ShoppingBag, Search, Menu, User, X, ChevronRight, Star, ShieldCheck, Truck, ArrowRight, MessageCircle, MapPin, Calendar, DollarSign, Package, CheckCircle, ArrowLeft, Info, Trash2, Plus, Minus, CreditCard, QrCode, Copy, Check, Smartphone, Mail, Loader2, Plane, Box, LogOut } from 'lucide-react';
import { Product, CartItem, Order, UserProfile, PageView } from './types';
import { PRODUCTS as MOCK_PRODUCTS, MOCK_USER, MOCK_ORDERS } from './constants';
import { GeminiService } from './services/geminiService';
import { supabase } from './supabaseClient';

// --- Context Definitions ---
interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, specificPrice?: number, specificMarketPrice?: number, specificStorage?: string) => void;
  removeFromCart: (productId: string, storage?: string) => void;
  updateQuantity: (productId: string, quantity: number, storage?: string) => void;
  user: UserProfile | null;
  login: (email: string) => void;
  logout: () => void;
  orders: Order[];
  placeOrder: (address: any, payment: any) => void;
  currentPage: PageView;
  navigateTo: (page: PageView) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  formatPrice: (price: number) => string;
  scrollToSection: (sectionId: string) => void;
  selectedProduct: Product | null;
  viewProduct: (product: Product) => void;
  products: Product[];
  isLoadingProducts: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- Services ---
const geminiService = new GeminiService();

// --- Components (UI) ---

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }: any) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#0071e3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow-md",
    secondary: "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]",
    outline: "border border-[#86868b] text-[#1d1d1f] hover:border-[#1d1d1f]",
    text: "text-[#0071e3] hover:underline px-0 py-0"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Input = React.forwardRef(({ label, className, icon, rightElement, ...props }: any, ref: any) => (
  <div className={`mb-4 ${className}`}>
    <div className="flex justify-between items-center mb-1">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
      {rightElement}
    </div>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full rounded-lg border border-gray-300 ${icon ? 'pl-10' : 'px-4'} py-3 text-sm focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-colors bg-white/50 backdrop-blur-sm placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500`}
      />
    </div>
  </div>
));

// --- Sub-Components (Navbar, Hero, etc.) ---
// MANTENHA TODO O CÓDIGO VISUAL AQUI (Navbar, Hero, HowItWorks, AboutUs, CartSidebar, Checkout, Auth, Dashboard)
// Como o arquivo é muito grande, estou reimplementando apenas as partes que mudam com os dados
// Mas no seu arquivo final, você deve manter TODOS os componentes visuais que eu já te dei.

const Navbar = () => {
  const { cart, navigateTo, user, setIsCartOpen, scrollToSection } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const handleNavClick = (section: string) => {
    navigateTo('home');
    setTimeout(() => scrollToSection(section), 100);
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => navigateTo('home')}>
             <span className="text-xl font-bold tracking-tight text-gray-900">Icrazybr</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => handleNavClick('hero')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Home</button>
            <button onClick={() => handleNavClick('products')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Ofertas de Natal</button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Como Funciona</button>
            <button onClick={() => handleNavClick('about')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Sobre Nós</button>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-600 hover:text-black transition-colors" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#0071e3] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => navigateTo(user ? 'dashboard' : 'login')} className="text-gray-600 hover:text-black transition-colors"><User size={20} strokeWidth={1.5} /></button>
            <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu size={20} strokeWidth={1.5} /></button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 py-4 px-4 shadow-xl">
           <button onClick={() => handleNavClick('hero')} className="block w-full text-left py-3 text-sm font-medium text-gray-800 border-b border-gray-50">Home</button>
           <button onClick={() => handleNavClick('products')} className="block w-full text-left py-3 text-sm font-medium text-gray-800 border-b border-gray-50">Ofertas de Natal</button>
           <button onClick={() => handleNavClick('how-it-works')} className="block w-full text-left py-3 text-sm font-medium text-gray-800 border-b border-gray-50">Como Funciona</button>
           <button onClick={() => handleNavClick('about')} className="block w-full text-left py-3 text-sm font-medium text-gray-800 border-b border-gray-50">Sobre Nós</button>
        </div>
      )}
    </nav>
  );
};

// ... Hero, HowItWorks, AboutUs, CartSidebar, Checkout, Auth, Dashboard components remain EXACTLY THE SAME as provided previously ...
// (Para economizar espaço, vou assumir que você tem esses códigos. Se não tiver, me avise que colo tudo novamente)
// VOU COLOCAR AQUI O PRODUCT GRID QUE É ONDE MUDA A LÓGICA DO SUPABASE

const Hero = () => {
  const { scrollToSection } = useAppContext();
  return (
    <div id="hero" className="relative overflow-hidden bg-[#f5f5f7] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-block bg-blue-100 text-[#0071e3] text-xs font-semibold px-3 py-1 rounded-full mb-6">Oferta Exclusiva de Natal 🎅</div>
        <h1 className="text-4xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-4 leading-tight">Seu iPhone novo com até <span className="text-[#0071e3]">40% de desconto</span>.</h1>
        <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed">A tecnologia que você ama, pelo preço justo que você merece. <br className="hidden md:block"/> Especialistas em importação e compra programada.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button onClick={() => scrollToSection('products')} className="px-8 py-4 text-base">Ver Tabela de Natal</Button>
          <Button variant="outline" onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 text-base bg-white">Como Funciona?</Button>
        </div>
        <div className="relative mx-auto max-w-5xl mt-8">
           <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop" alt="Produtos Apple Icrazybr" className="rounded-3xl shadow-2xl mx-auto border-4 border-white"/>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const { viewProduct, formatPrice, products, isLoadingProducts } = useAppContext();

  return (
    <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-[#f5f5f7]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
         <div>
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-2">Vitrine de Natal 🎅</h2>
            <p className="text-gray-500">Ofertas exclusivas para compra programada. De iPhone 13 a 17.</p>
         </div>
         <Button variant="text" onClick={() => {}} className="hidden md:flex items-center gap-1">
            Ver todo o estoque <ArrowRight size={16} />
         </Button>
      </div>
      
      {isLoadingProducts ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#0071e3]" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} onClick={() => viewProduct(product)} className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-transparent hover:border-blue-100 cursor-pointer">
              <div className="h-60 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 relative">
                 <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 {product.marketPrice && (
                   <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full z-10">
                      - {Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100)}% OFF
                   </div>
                 )}
              </div>
              
              <div className="flex flex-col flex-grow">
                 <div className="flex justify-between items-start mb-2">
                   <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{product.category}</div>
                   {product.rating && (
                     <div className="flex items-center text-yellow-500 text-xs gap-0.5">
                       <span className="font-medium text-gray-600 mr-1">{product.rating}</span>
                       <Star size={12} fill="currentColor" />
                     </div>
                   )}
                 </div>
                 
                 <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">{product.name}</h3>
                 
                 <div className="mt-auto pt-4">
                   {product.marketPrice && (
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 line-through">De: {formatPrice(product.marketPrice)}</span>
                        <span className="text-[10px] text-gray-400 font-medium">No Varejo</span>
                     </div>
                   )}

                   <div className="flex items-end justify-between gap-2">
                     <div>
                        <span className="block text-2xl font-bold text-[#1d1d1f]">{formatPrice(product.price)}</span>
                        <span className="text-[10px] font-semibold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">Valor na Compra Programada</span>
                     </div>
                     <Button variant="secondary" className="!px-3 !py-2 !rounded-xl group-hover:bg-[#0071e3] group-hover:text-white transition-colors">Ver Detalhes</Button>
                   </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center md:hidden">
         <Button variant="outline" className="w-full">Ver todo o estoque</Button>
      </div>
    </div>
  );
};

// ... Reutilize os componentes HowItWorks, AboutUs, CartSidebar, Checkout, Auth, Dashboard, ProductDetails, Footer que eu já forneci no código anterior ...
// VOU INCLUIR AQUI A LÓGICA DO APP PROVIDER ATUALIZADA

// Componentes Faltantes (Para garantir que funcione, vou colocar versões simplificadas se você não copiou antes, mas o ideal é usar as completas)
const HowItWorks = () => (
  <div id="how-it-works" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h3 className="text-3xl font-bold mb-8">Como funciona?</h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-2xl"><h4>1. Pedido Inteligente</h4><p>Pague menos importando direto.</p></div>
        <div className="p-6 border rounded-2xl"><h4>2. Envio Seguro</h4><p>15 a 30 dias úteis.</p></div>
        <div className="p-6 border rounded-2xl"><h4>3. Entrega Flexível</h4><p>Retire em Goiânia ou receba em casa.</p></div>
      </div>
    </div>
  </div>
);
const AboutUs = () => (<div id="about" className="py-24 bg-white text-center"><h3>Sobre Nós: Icrazybr - 7 Anos de Mercado</h3></div>);
const CartSidebar = () => { const {isCartOpen, setIsCartOpen} = useAppContext(); if(!isCartOpen) return null; return <div className="fixed inset-0 bg-black/50 z-50 flex justify-end"><div className="bg-white w-full max-w-md p-6"><button onClick={()=>setIsCartOpen(false)}>Fechar</button><h2>Carrinho</h2></div></div> };
const Checkout = () => <div>Checkout Component</div>;
const Auth = () => <div>Auth Component</div>;
const CustomerDashboard = () => <div>Dashboard Component</div>;
const ProductDetails = () => {
    const { selectedProduct, navigateTo, formatPrice, addToCart, setIsCartOpen } = useAppContext();
    if (!selectedProduct) return null;
    return (
        <div className="pt-10 pb-20 max-w-7xl mx-auto px-4">
            <button onClick={() => navigateTo('home')} className="mb-4">Voltar</button>
            <div className="grid md:grid-cols-2 gap-10">
                <img src={selectedProduct.image} className="w-full" />
                <div>
                    <h1 className="text-4xl font-bold">{selectedProduct.name}</h1>
                    <p className="text-2xl font-bold mt-4">{formatPrice(selectedProduct.price)}</p>
                    <button onClick={()=>{addToCart(selectedProduct); setIsCartOpen(true)}} className="bg-blue-600 text-white px-6 py-3 rounded mt-6">Adicionar</button>
                </div>
            </div>
        </div>
    )
};
const Footer = () => <footer className="py-10 bg-gray-100 text-center">Footer</footer>;


// --- Main App Logic ---

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Supabase State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          // Fallback to mock data if Supabase fails or is not set up
          setProducts(MOCK_PRODUCTS);
        } else if (data && data.length > 0) {
          // Map Supabase snake_case to CamelCase
          const formattedProducts = data.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            category: p.category || 'iPhone',
            price: p.programada_price || p.price, // Adapt based on your DB columns
            marketPrice: p.market_price,
            image: p.image || 'https://via.placeholder.com/400',
            description: p.description || '',
            inStock: p.in_stock !== false,
            rating: p.rating || 5,
            storageOptions: p.storage_options || [ // Fallback storage logic
                { capacity: '128GB', price: p.programada_price, marketPrice: p.market_price },
                { capacity: '256GB', price: p.programada_price + 500, marketPrice: p.market_price + 800 }
            ]
          }));
          setProducts(formattedProducts);
        } else {
           setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  const addToCart = (product: Product, specificPrice?: number, specificMarketPrice?: number, specificStorage?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedStorage === specificStorage);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedStorage === specificStorage)
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity: 1, 
        price: specificPrice || product.price, 
        marketPrice: specificMarketPrice || product.marketPrice,
        selectedStorage: specificStorage 
      }];
    });
  };

  const removeFromCart = (productId: string, storage?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedStorage === storage)));
  };

  const updateQuantity = (productId: string, quantity: number, storage?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedStorage === storage) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const login = (email: string) => {
    setUser({ ...MOCK_USER, email });
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const placeOrder = (address: any, payment: any) => {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 10000).toString(),
      date: new Date().toISOString(),
      status: 'Processing',
      currentStep: 1,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      address,
      paymentMethod: payment.method
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product-details');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      user, login, logout,
      orders, placeOrder,
      currentPage, navigateTo,
      isCartOpen, setIsCartOpen,
      formatPrice, scrollToSection,
      selectedProduct, viewProduct,
      products, isLoadingProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContent = () => {
  const { currentPage, navigateTo } = useAppContext();

  return (
    <div className="font-sans text-[#1d1d1f] antialiased min-h-screen flex flex-col">
      <Navbar />
      <CartSidebar />
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero />
            <ProductGrid />
            <HowItWorks />
            <AboutUs />
          </>
        )}

        {currentPage === 'product-details' && (
          <ProductDetails />
        )}

        {currentPage === 'checkout' && (
          <Checkout />
        )}

        {currentPage === 'login' && (
           <Auth />
        )}
        
        {currentPage === 'dashboard' && (
           <CustomerDashboard />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
