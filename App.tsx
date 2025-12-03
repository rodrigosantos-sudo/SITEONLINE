import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, ChevronRight, Star, ShieldCheck, Truck, ArrowRight, MessageCircle, X, Trash2, CheckCircle, Plane, Package } from 'lucide-react';

// --- DADOS DOS PRODUTOS (EMBUTIDOS PARA NÃO DAR ERRO) ---
const products = [
  {
    id: 1,
    name: "iPhone 13 128GB - Meia Noite",
    category: "iPhone",
    marketPrice: 4299.00,
    programadaPrice: 2599.00,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=800&auto=format&fit=crop",
    description: "O melhor custo-benefício atual. Chip A15 Bionic. Entrega programada em 15 a 30 dias úteis.",
    inStock: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "iPhone 14 128GB - Estelar",
    category: "iPhone",
    marketPrice: 4999.00,
    programadaPrice: 2899.00,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=800&auto=format&fit=crop",
    description: "Câmera aprimorada e bateria para o dia todo. Valor exclusivo para importação programada.",
    inStock: true,
    rating: 4.9
  },
  {
    id: 3,
    name: "iPhone 15 128GB - Titânio Natural",
    category: "iPhone",
    marketPrice: 6499.00,
    programadaPrice: 3499.00,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
    description: "A ilha dinâmica chegou. Design em vidro e alumínio. Envio seguro em 15-30 dias.",
    inStock: true,
    rating: 5.0
  },
  {
    id: 4,
    name: "MacBook Air M2 13\" - Cinza Espacial",
    category: "Mac",
    marketPrice: 8999.00,
    programadaPrice: 6299.00,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
    description: "Potência silenciosa. Design ultrafino. Ideal para trabalho e estudos. Importação direta.",
    inStock: true,
    rating: 4.9
  },
  {
    id: 5,
    name: "Apple Watch Ultra 2",
    category: "Watch",
    marketPrice: 6999.00,
    programadaPrice: 4899.00,
    image: "https://images.unsplash.com/photo-1673307223838-8e6f15779774?q=80&w=800&auto=format&fit=crop",
    description: "Para os aventureiros. Caixa de titânio robusta e bateria de longa duração.",
    inStock: true,
    rating: 5.0
  },
  {
    id: 6,
    name: "AirPods Pro (2ª Geração)",
    category: "Acessórios",
    marketPrice: 1899.00,
    programadaPrice: 1299.00,
    image: "https://images.unsplash.com/photo-1603351154351-5cf13e883efb?q=80&w=800&auto=format&fit=crop",
    description: "Cancelamento de ruído ativo 2x melhor. O companheiro perfeito para seu iPhone.",
    inStock: true,
    rating: 4.7
  }
];

// --- APP PRINCIPAL ---
export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [storage, setStorage] = useState('128GB');
  
  // Estado para simular login
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('icrazy_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const addToCart = (product, currentPrice) => {
    const newItem = { ...product, price: currentPrice, storageOption: storage };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    if (name) {
      localStorage.setItem('icrazy_user', name);
      setUser(name);
      alert(`Bem-vindo, ${name}!`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('icrazy_user');
    setUser(null);
    setView('home');
  };

  // --- COMPONENTES VISUAIS ---

  const Navbar = () => (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 onClick={() => setView('home')} className="text-xl font-bold tracking-tight cursor-pointer">Icrazybr</h1>
            <div className="hidden md:flex gap-6 text-sm text-gray-500">
              <button onClick={() => setView('home')} className="hover:text-black transition">Home</button>
              <button className="hover:text-black transition">Produtos</button>
              <button className="hover:text-black transition">Sobre Nós</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-black transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            {user ? (
               <div onClick={() => setView('dashboard')} className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-blue-600">
                 <User className="w-5 h-5" />
                 <span className="hidden sm:block">Olá, {user}</span>
               </div>
            ) : (
               <User className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => alert('Faça login na área do cliente')} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const Home = () => (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
      <div className="bg-gray-100 rounded-2xl p-8 mb-12 text-center sm:text-left sm:flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">Compra Programada Apple</h2>
          <p className="text-gray-600 mb-6 max-w-md">Garanta seu iPhone com até 30% de desconto importando direto com a Icrazybr. Prazo de 15 a 30 dias.</p>
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">Ver Ofertas</button>
        </div>
        <div className="hidden sm:block w-64 h-40 bg-gray-200 rounded-xl"></div> 
      </div>

      <h3 className="text-2xl font-bold mb-8">Vitrine de Ofertas 🔥</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} onClick={() => { setSelectedProduct(product); setView('product'); }} className="group cursor-pointer">
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 transition group-hover:bg-gray-100 relative overflow-hidden">
               <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                 -{Math.round(((product.marketPrice - product.programadaPrice)/product.marketPrice)*100)}% OFF
               </span>
               <img src={product.image} alt={product.name} className="w-full h-64 object-contain mix-blend-multiply mb-4" />
            </div>
            <h4 className="font-semibold text-lg">{product.name}</h4>
            <div className="flex items-baseline gap-2 mt-1">
               <span className="text-xs text-gray-400 line-through">De: R$ {product.marketPrice.toLocaleString('pt-BR')}</span>
               <span className="text-lg font-bold">R$ {product.programadaPrice.toLocaleString('pt-BR')}</span>
            </div>
            <p className="text-blue-600 text-xs font-medium mt-1">Valor na Compra Programada</p>
          </div>
        ))}
      </div>
    </div>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    const currentPrice = selectedProduct.programadaPrice; 

    return (
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        <button onClick={() => setView('home')} className="mb-8 text-sm text-gray-500 hover:text-black flex items-center gap-1">
          ← Voltar para a loja
        </button>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 bg-gray-50 rounded-3xl p-8 flex items-center justify-center">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full max-h-[500px] object-contain mix-blend-multiply" />
          </div>

          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedProduct.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                <span className="text-sm text-gray-500">(128 avaliações)</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-lg text-gray-400 line-through">Varejo: R$ {selectedProduct.marketPrice.toLocaleString('pt-BR')}</span>
                 <span className="text-4xl font-bold text-gray-900">R$ {currentPrice.toLocaleString('pt-BR')}</span>
                 <span className="text-blue-600 font-medium">em até 12x ou à vista no Pix</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
               <Plane className="w-6 h-6 text-blue-600 flex-shrink-0" />
               <div className="text-sm text-blue-800">
                 <span className="font-bold">Importação Programada:</span> Este produto é importado diretamente para você. 
                 O prazo de entrega é de <span className="font-bold">15 a 30 dias úteis</span>.
               </div>
            </div>

            <button 
              onClick={() => addToCart(selectedProduct, currentPrice)}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="pt-24 pb-12 max-w-3xl mx-auto px-4">
      {!user ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
          <h2 className="text-2xl font-bold mb-4">Acesse sua conta</h2>
          <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
            <input name="username" placeholder="Seu Nome" className="w-full border p-3 rounded-lg" required />
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-bold">Entrar</button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Olá, {user} 👋</h2>
            <button onClick={handleLogout} className="text-red-500 text-sm font-medium">Sair</button>
          </div>
          
          <h3 className="text-lg font-bold mb-4">Meus Pedidos Recentes</h3>
          <div className="bg-white border rounded-2xl p-6 mb-4 shadow-sm">
             <div className="flex justify-between mb-4 pb-4 border-b">
               <div>
                 <p className="text-xs text-gray-500">NÚMERO DO PEDIDO</p>
                 <p className="font-bold">#88210</p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-gray-500">TOTAL</p>
                 <p className="font-bold">R$ 4.199,00</p>
               </div>
             </div>
             
             <div className="relative mb-6">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-[10px] mt-2 font-medium text-gray-600">
                  <span>Confirmado</span>
                  <span>Importando</span>
                  <span className="text-blue-600">Em Trânsito ✈️</span>
                  <span>Entregue</span>
                </div>
             </div>

             <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
               <div>
                 <p className="font-medium">iPhone 15 128GB</p>
                 <p className="text-sm text-gray-500">Importação Programada</p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const Checkout = () => (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Checkout de Demonstração</h2>
      <p className="text-gray-500 mb-8">Nesta versão demo, o pagamento é apenas simulado.</p>
