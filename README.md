# El Puro Shop - Deployment & Kurulum Rehberi

Mevcut HTML uygulamanız **Next.js** kullanılarak tamamen dinamik bir altyapıya geçirildi. Yönetim paneli ve ürün kataloğu hazır!

## 1. Supabase (Veritabanı) Kurulumu

Ürün fotoğraflarının ve bilgilerinin kalıcı olması için projenin bir veritabanına ihtiyacı var.

1. [Supabase](https://supabase.com/)'e gidin ve ücretsiz bir hesap/proje oluşturun.
2. Proje ayarlarınızdan **URL** ve **anon key** değerlerini kopyalayın.
3. Supabase SQL Editörüne (Sol menüdeki SQL Editor sekmesi) gidin ve ana dizinde bulunan **`supabase_setup.sql`** dosyasındaki kodların tümünü yapıştırıp çalıştırın (Run).
   - Bu işlem `products` tablosunu ve resimler için `product-images` depolama (storage) alanını otomatik oluşturacaktır.

## 2. Çevre Değişkenleri (.env)

Kendi bilgisayarınızda (localhost) test etmek için proje klasöründe `el-puro-shop` içine **`.env.local`** adında bir dosya oluşturun ve içine şunları yazın:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sizin-proje-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sizin-anon-key-değeriniz
```

> **ÖNEMLİ:** Vercel'e yüklerken (deploy ederken) bu değerleri Vercel ayarlarından "Environment Variables" bölümüne eklemeniz gerekmektedir.

## 3. GitHub ve Vercel Üzerinden Yayına Alma

1. Visual Studio Code veya Terminal üzerinden projenizi (sadece `el-puro-shop` klasörünü) GitHub'a yükleyin.
2. [Vercel](https://vercel.com/)'e giriş yapın ve GitHub hesabınızı bağlayın.
3. Yüklediğiniz depoyu (repository) seçip **Import** deyin.
4. "Environment Variables" (Çevre Değişkenleri) bölümünde Supabase bilgilerinizi girmeyi unutmayın.
5. **Deploy** butonuna basın. Vercel her şeyi otomatik ayarlayacaktır.

## 4. Admin Kullanımı

Site yayına alındığında `siteniz.com/admin` veya yerel testte `localhost:3000/admin` adresinden yönetim paneline girebilirsiniz.

- **Varsayılan Şifre:** `admin123` *(Güvenlik için `src/app/admin/page.tsx` dosyasından şifrenizi değiştirebilir veya Env değişkenine bağlayabilirsiniz).*
- Sistemden kategori, fiyat ve puro yoğunluk seviyelerini seçerek dilediğiniz gibi fotoğraf ekleyip çıkarabilirsiniz.

Tebrikler, lüks tütün mağazanız artık dinamik ve yönetilebilir durumda! 💨
