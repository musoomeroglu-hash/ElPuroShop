'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  intensity?: 'light' | 'medium' | 'strong' | null;
  image_url: string;
  category: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('puro');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Eğer veritabanı boşsa veya bağlantı yoksa boş liste göster
          setProducts([]);
        }
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.category === activeTab);

  const scrollToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="announcement-bar py-2 px-4 text-center text-sm font-medium sticky top-0 z-50 whitespace-nowrap overflow-x-auto shadow-md">
        <span>🔥 Yeni stoklar geldi! Sınırlı sayıda üretim premium çeşitler eklendi.</span>
      </div>

      <nav className="wood-navbar py-4 shadow-lg relative z-40 border-b-2 border-[#c49a45]/20">
        <div className="container mx-auto px-5">
          <div className="text-[var(--color-accent)] font-serif text-2xl md:text-3xl font-bold text-center tracking-wide text-shadow-custom">
            El Puro Shop
          </div>
        </div>
      </nav>

      <section className="relative h-[75vh] min-h-[450px] flex items-center justify-center text-center hero-bg">
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative z-10 p-5 text-[var(--color-text-light)] max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl mb-5 text-[var(--color-accent)] hero-title-shadow leading-tight tracking-wider">
            Premium Tütün Keyfi
          </h1>
          <p className="text-lg md:text-xl mb-10 font-light opacity-90 tracking-wide max-w-xl mx-auto drop-shadow-md">
            Asaletin ve eşsiz aromaların buluşma noktası. Size özel tütün deneyimini keşfedin.
          </p>
          <a
            href="#catalog"
            onClick={scrollToCatalog}
            className="cta-btn inline-block py-4 px-10 text-lg font-bold rounded-[var(--radius-sm)] uppercase tracking-[0.15em]"
          >
            Seçkimizi İnceleyin
          </a>
        </div>
      </section>

      <section id="catalog" className="py-24 bg-[var(--color-bg-light)]">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="section-title font-serif text-4xl md:text-5xl text-[var(--color-primary)] font-bold relative inline-block">
              Özel Seçki Kataloğumuz
            </h2>
          </div>

          <div className="tabs flex overflow-x-auto gap-4 mb-16 pb-4 snap-x snap-mandatory md:justify-center">
            <button
              className={`tab-btn flex-none snap-start py-3 px-8 rounded-full text-base font-semibold whitespace-nowrap tracking-wide border-2 ${activeTab === 'puro' ? 'active border-[var(--color-primary)]' : 'border-transparent bg-white shadow-sm'}`}
              onClick={() => setActiveTab('puro')}
            >
              🚬 Puro
            </button>
            <button
              className={`tab-btn flex-none snap-start py-3 px-8 rounded-full text-base font-semibold whitespace-nowrap tracking-wide border-2 ${activeTab === 'mentol' ? 'active border-[var(--color-primary)]' : 'border-transparent bg-white shadow-sm'}`}
              onClick={() => setActiveTab('mentol')}
            >
              🌿 Mentollü Sigara
            </button>
            <button
              className={`tab-btn flex-none snap-start py-3 px-8 rounded-full text-base font-semibold whitespace-nowrap tracking-wide border-2 ${activeTab === 'pipo' ? 'active border-[var(--color-primary)]' : 'border-transparent bg-white shadow-sm'}`}
              onClick={() => setActiveTab('pipo')}
            >
              🪵 Pipo & Nargile
            </button>
            <button
              className={`tab-btn flex-none snap-start py-3 px-8 rounded-full text-base font-semibold whitespace-nowrap tracking-wide border-2 ${activeTab === 'aksesuar' ? 'active border-[var(--color-primary)]' : 'border-transparent bg-white shadow-sm'}`}
              onClick={() => setActiveTab('aksesuar')}
            >
              ✂️ Aksesuarlar
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--color-accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Katalog yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease_forwards]">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="card-img h-64 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                    {product.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-8xl opacity-40 filter drop-shadow-sm">
                        {product.category === 'mentol' ? '🌿' : product.category === 'pipo' ? '🪵' : product.category === 'puro' ? '🚬' : '✂️'}
                      </div>
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-grow">
                    <h3 className="font-serif text-2xl text-[var(--color-primary)] mb-3 leading-tight font-bold">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-[var(--color-secondary)] mb-4">{product.price}</p>
                    <p className="text-[15px] text-gray-600 mb-6 flex-grow leading-relaxed">{product.description}</p>

                    {product.intensity && (
                      <span className={`intensity ${product.intensity} px-4 py-1.5 rounded-md text-sm font-bold self-start uppercase tracking-wider`}>
                        💨 {product.intensity === 'light' ? 'Hafif' : product.intensity === 'medium' ? 'Orta' : 'Güçlü'}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-6xl mb-4 block opacity-30">🔍</span>
                  <h3 className="text-xl font-medium text-gray-700">Bu kategori henüz boş</h3>
                  <p className="text-gray-500 mt-2">Daha sonra tekrar kontrol ediniz.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <a
        href="https://wa.me/905376412174"
        className="floating-wa fixed bottom-6 right-6 md:bottom-9 md:right-9 w-16 h-16 rounded-full flex items-center justify-center text-white z-50 shadow-2xl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <MessageCircle size={32} />
      </a>

      <footer className="wood-footer pt-20 pb-8 text-center relative overflow-hidden">
        <div className="container mx-auto px-5 relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-accent)] mb-3 tracking-widest font-bold">El Puro Shop</h2>
          <p className="italic text-lg md:text-xl opacity-90 mb-12 text-gray-300 font-light">Asil Bir Tutku</p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-8 mb-16">
            <a
              href="https://wa.me/905376412174"
              className="contact-link whatsapp inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg border-2 w-full sm:w-auto shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-3" size={24} />
              WhatsApp ile İletişim
            </a>
            <a
              href="tel:+905376412174"
              className="contact-link phone inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg border-2 w-full sm:w-auto shadow-[inset_0_0_20px_rgba(196,154,69,0.1)]"
            >
              <Phone className="mr-3" size={24} />
              0537 641 21 74
            </a>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-white/5 p-6 rounded-2xl text-[15px] text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed shadow-inner">
            <strong className="text-gray-300">Yasal Uyarı:</strong> Bu site sadece bilgilendirme amaçlıdır; internet üzerinden tütün ve tütün ürünleri satışı yapılmamaktadır. Sadece <strong>18 yaş ve üzeri</strong> yasal yetişkinlere yöneliktir. Tütün ürünleri sağlığa zararlıdır.
          </div>

          <p className="text-sm font-medium opacity-50 pt-8 border-t border-white/10 tracking-wider uppercase">
            &copy; {new Date().getFullYear()} El Puro Shop. Tüm Hakları Saklıdır.
          </p>
        </div>
      </footer>
    </>
  );
}
