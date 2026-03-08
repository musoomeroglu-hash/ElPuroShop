'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Basit şifre koruması (Gerçek uygulamada çevre değişkenden alınmalı)
        // Şimdilik varsayılan şifre: admin123
        if (password === 'admin123') {
            // Çerez veya localStorage ile oturum kaydedilebilir
            sessionStorage.setItem('isAdmin', 'true');
            router.push('/admin/dashboard');
        } else {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-body)] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[var(--color-border)]">
                <div className="flex justify-center mb-6 text-[var(--color-primary)]">
                    <Lock size={48} />
                </div>
                <h1 className="text-3xl font-serif text-center text-[var(--color-primary)] mb-8">Admin Girişi</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yönetici Şifresi</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Şifrenizi girin..."
                            required
                        />
                        {error && <p className="text-red-500 text-sm mt-2">Hatalı şifre, lütfen tekrar deneyin.</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-colors shadow-md"
                    >
                        Giriş Yap
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                        &larr; Siteye Geri Dön
                    </a>
                </div>
            </div>
        </div>
    );
}
