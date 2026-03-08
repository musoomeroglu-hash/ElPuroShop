-- El Puro Shop - Supabase Veritabanı Kurulum Scripti

-- 1. 'products' tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    intensity TEXT CHECK (intensity IN ('light', 'medium', 'strong', NULL)),
    image_url TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Herkesin ürünleri okuyabilmesi için kurallar (RLS - Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes ürünleri görebilir" 
ON public.products FOR SELECT 
USING (true);

-- Admin'lerin ekleme/silme yapabilmesi için: (Şimdilik anon key ile deneme için açık, prod ortamında auth policy düzenlenmelidir)
CREATE POLICY "Anon anahtar ile ekleme/silme" 
ON public.products FOR ALL 
USING (true)
WITH CHECK (true);

-- 3. Storage Bucket oluştur (Resim yüklemeleri için)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Bucket için okuma izni
CREATE POLICY "Public Erişim" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- Bucket için yazma/silme izni (Test amaçlı açık)
CREATE POLICY "Public Yazma" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Public Silme" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' );
