import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { ShoppingBag, Search, Menu, User, X, ChevronRight, Star, ShieldCheck, Truck, ArrowRight, MessageCircle, MapPin, Calendar, DollarSign, Package, CheckCircle, ArrowLeft, Info, Trash2, Plus, Minus, CreditCard, QrCode, Copy, Check, Smartphone, Mail, Loader2, Plane, Box, LogOut } from 'lucide-react';
import { Product, CartItem, Order, UserProfile, PageView } from './types';
import { PRODUCTS, MOCK_USER, MOCK_ORDERS } from './constants';
import { GeminiService } from './services/geminiService';

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

// --- Sub-Components ---

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
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => navigateTo('home')}>
             <span className="text-xl font-bold tracking-tight text-gray-900">Icrazybr</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => handleNavClick('hero')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Home</button>
            <button onClick={() => handleNavClick('products')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Ofertas de Natal</button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Como Funciona</button>
            <button onClick={() => handleNavClick('about')} className="text-xs font-medium text-gray-600 hover:text-black transition-colors">Sobre Nós</button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-600 hover:text-black transition-colors" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0071e3] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => navigateTo(user ? 'dashboard' : 'login')} className="text-gray-600 hover:text-black transition-colors">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
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

const Hero = () => {
  const { scrollToSection } = useAppContext();
  
  return (
    <div id="hero" className="relative overflow-hidden bg-[#f5f5f7] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-block bg-blue-100 text-[#0071e3] text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Oferta Exclusiva de Natal 🎅
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-4 leading-tight">
          Seu iPhone novo com até <span className="text-[#0071e3]">40% de desconto</span>.
        </h1>
        <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          A tecnologia que você ama, pelo preço justo que você merece. <br className="hidden md:block"/> Especialistas em importação e compra programada.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button onClick={() => scrollToSection('products')} className="px-8 py-4 text-base">Ver Tabela de Natal</Button>
          <Button variant="outline" onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 text-base bg-white">Como Funciona?</Button>
        </div>
        
        {/* Hero Image Mockup */}
        <div className="relative mx-auto max-w-5xl mt-8">
           <img 
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop" 
            alt="Produtos Apple Icrazybr" 
            className="rounded-3xl shadow-2xl mx-auto border-4 border-white"
           />
           {/* Floating Badge */}
           <div className="absolute -bottom-6 right-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Economia Real</p>
                    <p className="font-bold text-[#1d1d1f]">Preço de Importação</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#0071e3] font-semibold tracking-wide uppercase text-sm mb-2">Entenda o Processo</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f]">Como funciona a Compra Programada?</h3>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Garanta o menor preço do mercado planejando sua compra. É simples, seguro e transparente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10"></div>

          {[
            {
              icon: <DollarSign size={32} className="text-white" />,
              title: "1. Pedido Inteligente",
              text: "Você escolhe seu iPhone na Tabela de Natal e paga um valor reduzido de importação, economizando muito em relação ao varejo nacional.",
              color: "bg-blue-500"
            },
            {
              icon: <Calendar size={32} className="text-white" />,
              title: "2. Envio Seguro",
              text: "Iniciamos a importação direta. Seu produto chega com segurança entre 15 a 30 dias úteis.",
              color: "bg-indigo-500"
            },
            {
              icon: <MapPin size={32} className="text-white" />,
              title: "3. Entrega Flexível",
              text: "Assim que chegar, você pode retirar pessoalmente em nossa loja física em Goiânia ou receber no conforto da sua casa.",
              color: "bg-green-500"
            }
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
              <div className={`w-20 h-20 mx-auto rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-[#1d1d1f] mb-3">{step.title}</h4>
              <p className="text-gray-500 leading-relaxed text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
             <img 
               src="https://images.unsplash.com/photo-1556228720-1957be83e3e0?q=80&w=1000&auto=format&fit=crop" 
               alt="Fachada da loja Icrazybr em Goiânia" 
               className="rounded-3xl shadow-2xl w-full relative z-10"
             />
             <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg max-w-xs border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-[#0071e3]" />
                  <span className="font-bold text-[#1d1d1f]">Loja Física</span>
                </div>
                <p className="text-sm text-gray-600">Visite nosso showroom em Goiânia. Tome um café e retire seu produto em mãos.</p>
             </div>
          </div>
          
          <div>
            <h2 className="text-[#0071e3] font-semibold tracking-wide uppercase text-sm mb-2">Quem Somos</h2>
            <h3 className="text-4xl font-bold text-[#1d1d1f] mb-6">Há 7 anos conectando você à Apple.</h3>
            <div className="space-y-6 text-lg text-gray-500 font-light">
              <p>
                A <strong>Icrazybr</strong> não é apenas uma loja online. Somos referência em Goiânia com loja física e suporte real.
              </p>
              <p>
                Atuamos há mais de 7 anos no mercado trazendo o melhor da tecnologia via importação direta, garantindo procedência e economia real para nossos clientes.
              </p>
              <p>
                Nossa missão é democratizar o acesso aos produtos Apple no Brasil, eliminando taxas abusivas através de um sistema logístico inteligente e legalizado.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-10">
               <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-[#1d1d1f]">Garantia Apple</h4>
                    <p className="text-xs text-gray-500">1 Ano Mundial</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-[#1d1d1f]">Suporte Real</h4>
                    <p className="text-xs text-gray-500">Equipe Especializada</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { selectedProduct, addToCart, navigateTo, formatPrice, setIsCartOpen } = useAppContext();
  
  // Visual states for interactivity
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);

  // Dynamic Pricing State
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number | undefined>(0);

  useEffect(() => {
    if (selectedProduct) {
      // Reset states when product changes
      setSelectedStorage(0);
      
      // Determine initial price based on storage options or base price
      if (selectedProduct.storageOptions && selectedProduct.storageOptions.length > 0) {
        setCurrentPrice(selectedProduct.storageOptions[0].price);
        setCurrentMarketPrice(selectedProduct.storageOptions[0].marketPrice);
      } else {
        setCurrentPrice(selectedProduct.price);
        setCurrentMarketPrice(selectedProduct.marketPrice);
      }
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const handleStorageChange = (index: number) => {
    setSelectedStorage(index);
    if (selectedProduct.storageOptions && selectedProduct.storageOptions[index]) {
      const option = selectedProduct.storageOptions[index];
      setCurrentPrice(option.price);
      setCurrentMarketPrice(option.marketPrice);
    }
  };

  const handleAddToCart = () => {
    let specificStorage = '';
    
    // Determine storage label
    if (selectedProduct.storageOptions && selectedProduct.storageOptions.length > 0) {
      specificStorage = selectedProduct.storageOptions[selectedStorage].capacity;
    }

    addToCart(selectedProduct, currentPrice, currentMarketPrice, specificStorage);
    setIsCartOpen(true);
  };

  const colors = [
    { name: 'Titânio Natural', class: 'bg-stone-400' },
    { name: 'Titânio Azul', class: 'bg-blue-900' },
    { name: 'Titânio Branco', class: 'bg-zinc-100 border border-gray-200' },
    { name: 'Titânio Preto', class: 'bg-zinc-900' }
  ];

  // Default storages if no options provided
  const displayStorages = selectedProduct.storageOptions 
    ? selectedProduct.storageOptions.map(opt => opt.capacity)
    : ['128GB', '256GB', '512GB'];

  const discount = currentMarketPrice 
    ? Math.round(((currentMarketPrice - currentPrice) / currentMarketPrice) * 100) 
    : 0;

  return (
    <div className="bg-white min-h-screen pt-10 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigateTo('home')} 
          className="mb-8 flex items-center text-gray-500 hover:text-[#0071e3] transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar para vitrine
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Image */}
          <div className="bg-[#f5f5f7] rounded-3xl p-10 flex items-center justify-center h-[500px] sticky top-24">
             <img 
               src={selectedProduct.image} 
               alt={selectedProduct.name} 
               className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform duration-500"
             />
          </div>

          {/* Right Column: Info */}
          <div>
            <div className="mb-6">
              <span className="text-[#0071e3] font-semibold text-sm tracking-wider uppercase mb-2 block">
                {selectedProduct.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">
                {selectedProduct.name}
              </h1>
              {selectedProduct.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-500">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={18} fill={i < Math.floor(selectedProduct.rating!) ? "currentColor" : "none"} />
                     ))}
                  </div>
                  <span className="text-sm text-gray-500">({selectedProduct.rating} de 5 estrelas)</span>
                </div>
              )}
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8">
               {currentMarketPrice && (
                 <div className="flex items-center gap-3 mb-2 text-gray-400 animate-fade-in">
                    <span className="line-through text-lg">De: {formatPrice(currentMarketPrice)}</span>
                    <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">Preço Varejo</span>
                 </div>
               )}
               <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-[#1d1d1f] transition-all duration-300">
                    {formatPrice(currentPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                      {discount}% OFF
                    </span>
                  )}
               </div>
               <p className="text-[#0071e3] text-sm font-medium mt-2">Valor exclusivo para Compra Programada</p>
            </div>

            {/* Selectors */}
            <div className="mb-8">
               <h3 className="font-semibold text-gray-900 mb-3">Cor</h3>
               <div className="flex gap-4">
                 {colors.map((color, idx) => (
                   <button
                     key={idx}
                     onClick={() => setSelectedColor(idx)}
                     className={`w-10 h-10 rounded-full shadow-sm ring-offset-2 transition-all ${color.class} ${selectedColor === idx ? 'ring-2 ring-[#0071e3] scale-110' : 'hover:scale-105'}`}
                     title={color.name}
                   />
                 ))}
               </div>
               <p className="mt-2 text-sm text-gray-500">Cor selecionada: <span className="font-medium text-gray-900">{colors[selectedColor].name}</span></p>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Armazenamento</h3>
              <div className="grid grid-cols-3 gap-3">
                 {displayStorages.map((storage, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleStorageChange(idx)}
                     className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${selectedStorage === idx ? 'border-[#0071e3] text-[#0071e3] bg-blue-50 ring-1 ring-[#0071e3]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                   >
                     {storage}
                   </button>
                 ))}
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-4">
               <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit flex-shrink-0">
                  <Package size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-blue-900 text-sm mb-1">Importação Programada</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                     Ao finalizar esta compra, você concorda que este é um pedido de importação. 
                     <strong> O prazo de entrega é de 15 a 30 dias úteis</strong>. Garantimos o rastreio e a entrega segura.
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
               <Button 
                  className="flex-1 py-4 text-lg rounded-2xl shadow-lg shadow-blue-500/20"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
               >
                 {selectedProduct.inStock ? "Adicionar à Sacola" : "Esgotado"}
               </Button>
            </div>
            
            <p className="mt-6 text-xs text-gray-500 text-center">
               <ShieldCheck size={14} className="inline mr-1" />
               Garantia Mundial Apple de 1 Ano inclusa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const { viewProduct, formatPrice } = useAppContext();

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => (
          <div 
             key={product.id} 
             onClick={() => viewProduct(product)}
             className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-transparent hover:border-blue-100 cursor-pointer"
          >
            <div className="h-60 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 relative">
               <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
               
               {/* Badge de Economia */}
               {product.marketPrice && (
                 <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    - {Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100)}% OFF
                 </div>
               )}
            </div>
            
            <div className="flex flex-col flex-grow">
               <div className="flex justify-between items-start mb-2">
                 <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {product.category}
                 </div>
                 {product.rating && (
                   <div className="flex items-center text-yellow-500 text-xs gap-0.5">
                     <span className="font-medium text-gray-600 mr-1">{product.rating}</span>
                     <Star size={12} fill="currentColor" />
                   </div>
                 )}
               </div>
               
               <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">{product.name}</h3>
               
               <div className="mt-auto pt-4">
                 {/* Preço de Mercado (Comparativo) */}
                 {product.marketPrice && (
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 line-through">De: {formatPrice(product.marketPrice)}</span>
                      <span className="text-[10px] text-gray-400 font-medium">No Varejo</span>
                   </div>
                 )}

                 <div className="flex items-end justify-between gap-2">
                   <div>
                      <span className="block text-2xl font-bold text-[#1d1d1f]">{formatPrice(product.price)}</span>
                      <span className="text-[10px] font-semibold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Valor na Compra Programada
                      </span>
                   </div>
                   <Button 
                      variant="secondary"
                      className="!px-3 !py-2 !rounded-xl group-hover:bg-[#0071e3] group-hover:text-white transition-colors"
                   >
                     Ver Detalhes
                   </Button>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center md:hidden">
         <Button variant="outline" className="w-full">Ver todo o estoque</Button>
      </div>
    </div>
  );
};

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, navigateTo, formatPrice } = useAppContext();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-[#1d1d1f]">Sua Sacola</h2>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Sua sacola está vazia</p>
                  <p className="text-sm text-gray-500">Parece que você ainda não escolheu seu novo Apple.</p>
                </div>
                <Button variant="text" onClick={() => setIsCartOpen(false)}>
                  Começar a comprar
                </Button>
              </div>
            ) : (
              cart.map((item, idx) => (
                // Use composite key because same product ID might have different storages (although logic below uses a unique approach, adding idx is safe)
                <div key={`${item.id}-${item.selectedStorage || idx}`} className="flex gap-4 group">
                  {/* Image */}
                  <div className="w-24 h-24 bg-[#f5f5f7] rounded-xl flex-shrink-0 flex items-center justify-center p-2">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[#1d1d1f] line-clamp-2 leading-tight">{item.name}</h3>
                        <span className="font-medium text-[#1d1d1f] ml-2 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.category} • {item.selectedStorage} • Compra Programada
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedStorage)} 
                          className="p-1.5 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedStorage)} 
                          className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedStorage)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-[#f5f5f7]">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <div className="flex items-center gap-1.5 text-gray-500">
                     <span>Entrega (Importação)</span>
                     <Info size={12} />
                   </div>
                   <span className="text-[#0071e3] font-medium">Grátis</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-gray-200">
                  <span className="text-lg font-bold text-[#1d1d1f]">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-[#1d1d1f]">{formatPrice(subtotal)}</span>
                    <span className="text-[10px] text-gray-500 font-normal">Em até 12x no cartão</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full py-4 text-base bg-[#1d1d1f] hover:bg-black text-white shadow-lg" 
                  onClick={() => { setIsCartOpen(false); navigateTo('checkout'); }}
                >
                  Finalizar Compra
                </Button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { cart, placeOrder, navigateTo, formatPrice } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // CEP Loading State
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', cpf: '', email: '', phone: '',
    cep: '', address: '', number: '', district: '', city: '',
    cardName: '', cardNumber: '', cardExp: '', cardCvv: '', installments: '1'
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // 5% discount for PIX
  const total = paymentMethod === 'pix' ? subtotal * 0.95 : subtotal;
  const discountAmount = subtotal - total;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Logic for CEP Auto-complete
    if (name === 'cep') {
      const cleanValue = value.replace(/\D/g, ''); // Keep numbers only for logic
      
      // Update the input immediately
      setFormData(prev => ({ ...prev, [name]: value }));

      if (cleanValue.length === 8) {
        setIsLoadingCep(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanValue}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              address: data.logradouro,
              district: data.bairro,
              city: `${data.localidade} - ${data.uf}`,
              cep: value // Maintain the typed value
            }));
            
            // Focus on number input
            setTimeout(() => {
               numberInputRef.current?.focus();
            }, 100);
          } else {
            // CEP not found silently or show a toast
            console.log("CEP não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        } finally {
          setIsLoadingCep(false);
        }
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmOrder = () => {
    // Basic validation could go here
    placeOrder({
      line1: `${formData.address}, ${formData.number}`,
      city: formData.city,
      zip: formData.cep
    }, {
      method: paymentMethod === 'pix' ? 'PIX' : 'Credit Card'
    });
    
    setShowSuccess(true);
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Adicione itens para prosseguir com o checkout.</p>
        <Button onClick={() => navigateTo('home')}>Voltar para Loja</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Pedido Realizado!</h2>
              <p className="text-gray-500 mb-6">
                Seu pedido <strong>#{Math.floor(Math.random() * 10000)}</strong> foi confirmado com sucesso.
                Enviamos os detalhes para seu e-mail.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 text-sm text-left">
                 <p className="mb-2"><strong>Prazo estimado:</strong> 15 a 30 dias úteis</p>
                 <p><strong>Status:</strong> Em processamento</p>
              </div>
              <Button onClick={() => { setShowSuccess(false); navigateTo('home'); }} className="w-full">
                Voltar para Loja
              </Button>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Personal Data */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={20} className="text-[#0071e3]" /> Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" label="Nome Completo" placeholder="Ex: João da Silva" value={formData.name} onChange={handleInputChange} />
                <Input name="cpf" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleInputChange} />
                <Input name="email" label="E-mail" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} />
                <Input name="phone" label="Celular" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleInputChange} />
              </div>
            </section>

            {/* Address */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#0071e3]" /> Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Input 
                    name="cep" 
                    label="CEP" 
                    placeholder="00000-000" 
                    className="md:col-span-1" 
                    value={formData.cep} 
                    onChange={handleInputChange}
                    rightElement={isLoadingCep && <span className="text-xs text-[#0071e3] flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Buscando...</span>}
                 />
                 <Input name="address" label="Rua" placeholder="Av. Paulista" className="md:col-span-2" value={formData.address} onChange={handleInputChange} disabled={isLoadingCep} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Input 
                    ref={numberInputRef}
                    name="number" 
                    label="Número" 
                    placeholder="1000" 
                    value={formData.number} 
                    onChange={handleInputChange} 
                 />
                 <Input name="district" label="Bairro" placeholder="Bela Vista" value={formData.district} onChange={handleInputChange} />
                 <Input name="city" label="Cidade/UF" placeholder="São Paulo - SP" value={formData.city} onChange={handleInputChange} />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign size={20} className="text-[#0071e3]" /> Pagamento
              </h2>
              
              {/* Tabs */}
              <div className="flex gap-4 p-1 bg-gray-100 rounded-xl mb-8">
                 <button 
                   onClick={() => setPaymentMethod('pix')}
                   className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${paymentMethod === 'pix' ? 'bg-white shadow-sm text-[#0071e3]' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   <QrCode size={18} /> PIX (5% OFF)
                 </button>
                 <button 
                   onClick={() => setPaymentMethod('card')}
                   className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-white shadow-sm text-[#0071e3]' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   <CreditCard size={18} /> Cartão de Crédito
                 </button>
              </div>

              {/* PIX Content */}
              {paymentMethod === 'pix' && (
                <div className="text-center py-4 animate-fade-in">
                   <div className="inline-block p-4 bg-white border-2 border-[#0071e3] border-dashed rounded-xl mb-4">
                      <QrCode size={120} className="text-[#1d1d1f]" />
                   </div>
                   <p className="text-sm text-gray-500 mb-4">Escaneie o QR Code ou copie a chave abaixo</p>
                   <div className="flex items-center gap-2 max-w-sm mx-auto">
                      <input readOnly value="00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate" />
                      <button className="p-2 text-[#0071e3] hover:bg-blue-50 rounded-lg" title="Copiar">
                        <Copy size={20} />
                      </button>
                   </div>
                   <div className="mt-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl inline-flex items-center gap-2 text-sm font-medium">
                      <Check size={16} /> Desconto de 5% aplicado no valor total!
                   </div>
                </div>
              )}

              {/* Card Content */}
              {paymentMethod === 'card' && (
                <div className="animate-fade-in">
                   <Input name="cardNumber" label="Número do Cartão" placeholder="0000 0000 0000 0000" icon={<CreditCard />} value={formData.cardNumber} onChange={handleInputChange} />
                   <Input name="cardName" label="Nome Impresso no Cartão" placeholder="JOAO DA SILVA" value={formData.cardName} onChange={handleInputChange} />
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input name="cardExp" label="Validade" placeholder="MM/AA" value={formData.cardExp} onChange={handleInputChange} />
                      <Input name="cardCvv" label="CVV" placeholder="123" value={formData.cardCvv} onChange={handleInputChange} />
                   </div>
                   <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Parcelamento</label>
                      <select 
                        name="installments"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none bg-white"
                        value={formData.installments}
                        onChange={handleInputChange}
                      >
                         {[...Array(12)].map((_, i) => (
                           <option key={i} value={i+1}>{i+1}x de {formatPrice(total / (i+1))} sem juros</option>
                         ))}
                      </select>
                   </div>
                </div>
              )}

            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                   {cart.map((item, idx) => (
                     <div key={`${item.id}-${idx}`} className="flex gap-4">
                        <div className="w-16 h-16 bg-[#f5f5f7] rounded-lg flex items-center justify-center flex-shrink-0">
                           <img src={item.image} className="w-10 h-10 object-contain mix-blend-multiply" alt={item.name} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-medium text-[#1d1d1f] line-clamp-1">{item.name}</h4>
                           <p className="text-xs text-gray-500">{item.selectedStorage} • Qtd: {item.quantity}</p>
                           <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                   <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                   </div>
                   {paymentMethod === 'pix' && (
                     <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto PIX (5%)</span>
                        <span>- {formatPrice(discountAmount)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete (Importação)</span>
                      <span className="text-[#0071e3] font-medium">Grátis</span>
                   </div>
                   <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-2">
                      <span className="text-lg font-bold text-[#1d1d1f]">Total</span>
                      <span className="text-2xl font-bold text-[#1d1d1f]">{formatPrice(total)}</span>
                   </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                   <Calendar className="text-blue-600 flex-shrink-0" size={20} />
                   <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Prazo de entrega:</strong> 15 a 30 dias úteis após postagem. Pedido de Importação Programada.
                   </p>
                </div>

                <Button className="w-full py-4 text-base" onClick={handleConfirmOrder}>
                   Confirmar Pagamento
                </Button>
                
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                   <ShieldCheck size={12} /> Ambiente 100% Seguro
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const { login, navigateTo } = useAppContext();
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? 'Bem-vindo de volta.' : 'Crie sua conta Icrazybr.'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Acompanhe seus pedidos de importação.' : 'Comece a economizar hoje.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="exemplo@icloud.com" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Senha" 
            type="password" 
            placeholder="Obrigatório" 
            required 
          />
          
          <div className="pt-4">
             <Button type="submit" className="w-full py-3">{isLogin ? 'Entrar' : 'Criar Conta'}</Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Primeira vez aqui? " : "Já é cliente? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#0071e3] hover:underline font-medium"
            >
              {isLogin ? 'Crie sua conta.' : 'Entre agora.'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const { user, orders, logout, navigateTo, formatPrice } = useAppContext();

  if (!user) {
    navigateTo('login');
    return null;
  }

  // Steps definition for timeline
  const timelineSteps = [
    { step: 1, label: "Pedido Confirmado", icon: CheckCircle },
    { step: 2, label: "Preparando Importação", icon: Box },
    { step: 3, label: "Em Trânsito Internacional", icon: Plane },
    { step: 4, label: "Saiu para Entrega", icon: Truck },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-[#1d1d1f]">Olá, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-500">Acompanhe seus pedidos de importação.</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); navigateTo('home'); }} className="flex items-center gap-2">
           <LogOut size={16} /> Sair
        </Button>
      </div>

      <div className="space-y-12">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
             <Package size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
             <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra conosco.</p>
             <Button onClick={() => navigateTo('home')}>Ir para a Loja</Button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               {/* Header of Card */}
               <div className="bg-[#f5f5f7] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                  <div className="flex gap-6 text-sm">
                     <div>
                        <span className="block text-gray-500 text-xs uppercase mb-0.5">Pedido</span>
                        <span className="font-semibold text-[#1d1d1f]">#{order.id}</span>
                     </div>
                     <div>
                        <span className="block text-gray-500 text-xs uppercase mb-0.5">Data</span>
                        <span className="font-medium text-[#1d1d1f]">{new Date(order.date).toLocaleDateString()}</span>
                     </div>
                     <div>
                        <span className="block text-gray-500 text-xs uppercase mb-0.5">Total</span>
                        <span className="font-medium text-[#1d1d1f]">{formatPrice(order.total)}</span>
                     </div>
                  </div>
                  <Button variant="text" className="!text-xs">Ver Detalhes</Button>
               </div>

               {/* Timeline Section */}
               <div className="p-8">
                  <div className="relative">
                     {/* Connecting Line Background */}
                     <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full -z-10" />
                     
                     {/* Active Line (Calculated Width) */}
                     <div 
                        className="absolute top-5 left-0 h-1 bg-green-500 rounded-full -z-10 transition-all duration-1000 ease-out" 
                        style={{ width: `${((order.currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
                     />

                     <div className="flex justify-between relative">
                        {timelineSteps.map((stepObj) => {
                           const isCompleted = order.currentStep > stepObj.step;
                           const isCurrent = order.currentStep === stepObj.step;
                           const isFuture = order.currentStep < stepObj.step;

                           return (
                              <div key={stepObj.step} className="flex flex-col items-center group cursor-default">
                                 <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 
                                       ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                                       ${isCurrent ? 'bg-white border-[#0071e3] text-[#0071e3] scale-110 shadow-lg' : ''}
                                       ${isFuture ? 'bg-white border-gray-200 text-gray-300' : ''}
                                    `}
                                 >
                                    <stepObj.icon size={isCurrent ? 20 : 16} strokeWidth={isCurrent ? 2.5 : 2} />
                                 </div>
                                 <span className={`text-xs mt-3 font-medium text-center max-w-[100px] transition-colors duration-300
                                    ${isCurrent ? 'text-[#0071e3]' : 'text-gray-500'}
                                    ${isCompleted ? 'text-green-600' : ''}
                                 `}>
                                    {stepObj.label}
                                 </span>
                                 {isCurrent && order.currentStep === 3 && (
                                    <span className="text-[10px] text-orange-500 font-semibold mt-1 bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                                       15-20 dias
                                    </span>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>

               {/* Items List (Compact) */}
               <div className="bg-gray-50/50 p-6 border-t border-gray-100">
                  {order.items.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1">
                           <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-[#1d1d1f]">{item.name}</p>
                           <p className="text-xs text-gray-500">{item.selectedStorage}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Main App Logic ---

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); // Initialize with mock orders
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      currentStep: 1, // Start at step 1
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
      selectedProduct, viewProduct
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

        {/* Fallback for other pages */}
        {['cart'].includes(currentPage) && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Página em Construção</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Estamos trabalhando duro para trazer a melhor experiência para você. 
              A página <strong>{currentPage}</strong> estará disponível em breve.
            </p>
            <Button onClick={() => navigateTo('home')}>
              Voltar para o Início
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-[#f5f5f7] py-8 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            <p>© 2024 Icrazybr. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <a href="#" className="hover:underline">Termos de Uso</a>
            <a href="#" className="hover:underline">Política de Vendas</a>
          </div>
        </div>
      </footer>
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