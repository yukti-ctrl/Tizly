-- =======================================================
-- TIZLY DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- =======================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'vet', 'seller', 'user'
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    category VARCHAR(50) DEFAULT 'General', -- 'Food', 'Vet Care', 'Toys', 'Accessories', 'Supplies'
    stock_qty INTEGER DEFAULT 10,
    image_url TEXT,
    rating_avg DOUBLE PRECISION DEFAULT 4.8,
    seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);

-- 4. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE
);

-- 5. VETS TABLE (DOCTORS)
CREATE TABLE IF NOT EXISTS vets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) DEFAULT 'General Care',
    bio TEXT,
    image_url TEXT,
    available_slots VARCHAR(255) DEFAULT 'Mon - Fri: 9:00 AM - 5:00 PM'
);

-- 6. VET APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS vet_appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vet_id INTEGER REFERENCES vets(id) ON DELETE SET NULL,
    pet_name VARCHAR(100) NOT NULL,
    pet_type VARCHAR(50) DEFAULT 'Dog',
    reason TEXT,
    preferred_date VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION (PUBLIC ACCESS)
-- =======================================================

-- Create the public storage bucket for images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('tizly-media', 'tizly-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images in tizly-media
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Access for tizly-media'
    ) THEN
        CREATE POLICY "Public Access for tizly-media"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'tizly-media');
    END IF;
END $$;

-- Allow authenticated and service uploads to tizly-media
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Upload Access for tizly-media'
    ) THEN
        CREATE POLICY "Upload Access for tizly-media"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'tizly-media');
    END IF;
END $$;
