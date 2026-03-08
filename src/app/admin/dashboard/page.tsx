'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Package, LogOut, Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    intensity?: 'light' | 'medium' | 'strong' | null;
    image_url: string;
    category: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'puro',
        intensity: '',
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Basit auth kontrolü
    useEffect(() => {
        const isAdmin = sessionStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
        } else {
            setIsLoading(false);
            fetchProducts();
        }
    }, [router]);

    const fetchProducts = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Ürünler çekilemedi:', error);
        } else {
            setProducts(data || []);
        }
        setIsFetching(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        router.push('/admin');
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', category: 'puro', intensity: '' });
        setUploadFile(null);
        setPreviewUrl('');
        setCurrentId('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openAddModal = () => {
        resetForm();
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        resetForm();
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || '',
            category: product.category,
            intensity: product.intensity || '',
        });
        setPreviewUrl(product.image_url || '');
        setCurrentId(product.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

        // Extract filename from URL if it's from our storage
        if (imageUrl && imageUrl.includes('supabase')) {
            const parts = imageUrl.split('/');
            const filename = parts[parts.length - 1];
            if (filename) {
                await supabase.storage.from('product-images').remove([filename]);
            }
        }

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Hata: ' + error.message);
        } else {
            fetchProducts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let finalImageUrl = previewUrl;

            // Resim yükleme işlemi
            if (uploadFile) {
                const fileExt = uploadFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;

                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, uploadFile);

                if (uploadError) throw uploadError;

                // Public URL al
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                finalImageUrl = publicUrl;
            }

            const productData = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                category: formData.category,
                intensity: formData.intensity ? formData.intensity : null,
                image_url: finalImageUrl
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchProducts();
        } catch (err: any) {
            alert('İşlem başarısız: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navbar */}
            <nav className="bg-[var(--color-primary)] text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="font-serif text-2xl tracking-wide text-[var(--color-accent)]">El Puro Shop Admin</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-red-300 transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    Çıkış Yap
                </button>
            </nav>

            <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white shadow-lg z-10 p-5 hidden md:block border-r border-gray-200">
                    <ul className="space-y-2">
                        <li>
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors font-medium bg-[var(--color-bg-body)] text-[var(--color-primary)]"
                            >
                                <Package size={20} />
                                Ürün Yönetimi
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Ürün Listesi</h2>
                            <button
                                onClick={openAddModal}
                                className="bg-[var(--color-accent)] hover:bg-[#b08736] text-[var(--color-primary)] px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center"
                            >
                                <Plus size={20} />
                                Yeni Ürün Ekle
                            </button>
                        </div>

                        {/* Config Warning */}
                        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
                            <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-6 rounded shadow-sm text-yellow-800">
                                <p className="font-bold">Supabase Bağlantısı Eksik!</p>
                                <p className="text-sm mt-1">Lütfen <code>.env.local</code> dosyasını oluşturun ve Supabase URL + Anon Key değerlerini ekleyin.</p>
                            </div>
                        )}

                        {/* Dashboard Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-semibold w-24">Görsel</th>
                                            <th className="p-4 font-semibold">Ürün Adı</th>
                                            <th className="p-4 font-semibold w-32">Kategori</th>
                                            <th className="p-4 font-semibold w-32">Fiyat</th>
                                            <th className="p-4 font-semibold text-right w-24">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {isFetching ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400">Yükleniyor...</td>
                                            </tr>
                                        ) : products.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                                    Henüz ürün eklenmemiş. Yeni ürün eklemek için yukarıdaki butonu kullanın.
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                                            {item.image_url ? (
                                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon size={20} className="text-gray-400" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-semibold text-gray-800">{item.name}</div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-[var(--color-bg-body)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-700">{item.price}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditModal(item)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                title="Düzenle"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.image_url)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Sil"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease_forwards]">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                                            placeholder="Örn: Cohiba Siglo VI"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                                            placeholder="Örn: ₺3,800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none bg-white"
                                            >
                                                <option value="puro">Puro</option>
                                                <option value="mentol">Mentollü Sigara</option>
                                                <option value="pipo">Pipo & Nargile</option>
                                                <option value="aksesuar">Aksesuar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Yoğunluk</label>
                                            <select
                                                value={formData.intensity}
                                                onChange={e => setFormData({ ...formData, intensity: e.target.value })}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none bg-white"
                                            >
                                                <option value="">Belirtme</option>
                                                <option value="light">Hafif</option>
                                                <option value="medium">Orta</option>
                                                <option value="strong">Güçlü</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Görseli</label>

                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-[var(--color-accent)] transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-medium drop-shadow-md flex items-center gap-2">
                                                            <Upload size={18} /> Değiştir
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Tıklayıp fotoğraf seçin</span>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Ürün hakkında kısa bilgi..."
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[#2b1f17] transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        isEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
