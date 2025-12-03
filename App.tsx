import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, ChevronRight, Star, ShieldCheck, Truck, ArrowRight, MessageCircle, X, Trash2, CheckCircle, Plane, Package } from 'lucide-react';
// Importa o cliente do banco de dados
import { supabase } from './supabaseClient';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [storage, setStorage] = useState('128GB');
  const [user, setUser] = useState(null);

  // NOVO: Estado para guardar os produtos que vêm do banco
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar produtos do Supabase ao carregar a página
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        // Mapeia os nomes do banco (snake_case) para o frontend (camelCase)
        const formattedProducts = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            marketPrice: p.market_price,
            programadaPrice: p.programada_price,
            image: p.image,
            description: p.description,
            inStock: p.in_stock,
            rating: p.rating
        }));
        setProducts(formattedProducts);
      }
      setLoading(false);
    }

    fetchProducts();
    
    // Carregar usuário
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
      
      {/* Loading State */}
      {loading ? (
          <div className="text-center py-20">Carregando produtos...</div>
      ) : (
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
      )}
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
                <span className="text-sm text-gray-500">(Avaliação: {selectedProduct.rating})</span>
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md mx-auto">
        <div className="flex justify-between mb-4 text-lg font-bold">
           <span>Total a pagar:</span>
           <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
        </div>
        <button 
          onClick={() => { setCart([]); setView('dashboard'); alert('Compra realizada com sucesso! Acompanhe na área do cliente.'); }}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
        >
          Confirmar "Pagamento"
        </button>
        <button onClick={() => setIsCartOpen(true)} className="mt-4 text-sm text-gray-500 underline">Voltar ao carrinho</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Seu Carrinho ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} className="w-16 h-16 object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.storageOption}</p>
                    <p className="font-bold mt-1">R$ {item.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center text-gray-400 mt-10">Seu carrinho está vazio.</p>}
            </div>

            <div className="border-t pt-6 mt-6">
               <div className="flex justify-between text-xl font-bold mb-6">
                 <span>Total</span>
                 <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
               </div>
               <button 
                 onClick={() => { setIsCartOpen(false); setView('checkout'); }}
                 className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50"
                 disabled={cart.length === 0}
               >
                 Finalizar Compra
               </button>
            </div>
          </div>
        </div>
      )}

      {view === 'home' && <Home />}
      {view === 'product' && <ProductDetail />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'checkout' && <Checkout />}
    </div>
  );
}
