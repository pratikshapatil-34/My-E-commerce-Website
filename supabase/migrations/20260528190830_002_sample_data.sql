/*
  # Sample Data for E-Commerce Platform

  This migration inserts realistic sample data for:
  - Categories (with hierarchy)
  - Products (with varied attributes)
  - Reviews
  - Coupons
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
('Home & Living', 'home-living', 'Furniture, decor, and home essentials', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', 3),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=400', 4),
('Books', 'books', 'Books, ebooks, and educational materials', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 5),
('Beauty', 'beauty', 'Skincare, makeup, and beauty products', 'https://images.pexels.com/photos/159829/bath-bomb-pink-bubbles-foam-159829.jpeg?auto=compress&cs=tinysrgb&w=400', 6),
('Toys & Games', 'toys-games', 'Toys, games, and entertainment', 'https://images.pexels.com/photos/163077/mario-yoschii-nintendo-video-game-163077.jpeg?auto=compress&cs=tinysrgb&w=400', 7),
('Automotive', 'automotive', 'Car accessories and automotive tools', 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=400', 8);

-- Insert Subcategories (children of Electronics)
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Smartphones', 'smartphones', 'Mobile phones and accessories', (SELECT id FROM categories WHERE slug = 'electronics'), 1),
('Laptops', 'laptops', 'Notebooks and laptops', (SELECT id FROM categories WHERE slug = 'electronics'), 2),
('Audio', 'audio', 'Headphones, speakers, and sound systems', (SELECT id FROM categories WHERE slug = 'electronics'), 3),
('Wearables', 'wearables', 'Smartwatches and fitness trackers', (SELECT id FROM categories WHERE slug = 'electronics'), 4);

-- Insert Products (Electronics)
INSERT INTO products (name, slug, description, short_description, price, compare_at_price, sku, quantity, category_id, brand, images, tags, is_featured, is_new, rating, reviews_count) VALUES
('Premium Wireless Headphones', 'premium-wireless-headphones', 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers and professionals.', 'Premium noise-cancelling headphones with 40-hour battery', 299.00, 399.00, 'WH-PRO-001', 150, (SELECT id FROM categories WHERE slug = 'audio'), 'SoundMax', '["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/1597205/pexels-photo-1597205.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["headphones", "wireless", "noise-cancelling", "audio"]', true, false, 4.8, 124),

('Smart Fitness Watch Pro', 'smart-fitness-watch-pro', 'Track your health and fitness goals with precision. Features include heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water-resistant up to 50 meters.', 'Advanced fitness tracker with GPS and heart monitoring', 199.00, 249.00, 'SW-PRO-002', 89, (SELECT id FROM categories WHERE slug = 'wearables'), 'FitTech', '["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["smartwatch", "fitness", "health", "wearable"]', true, true, 4.6, 89),

('Ultra 15.6 Laptop', 'ultra-15-6-laptop', 'Powerful laptop with Intel i7 processor, 16GB RAM, 512GB SSD, and stunning 4K display. Perfect for professionals and creators. Ultra-slim design at just 1.2kg.', 'Premium laptop with i7, 16GB RAM, 4K display', 1299.00, 1499.00, 'LT-ULT-003', 45, (SELECT id FROM categories WHERE slug = 'laptops'), 'TechCore', '["https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/196844/pexels-photo-196844.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["laptop", "computer", "work", "4K"]', true, false, 4.7, 67),

('Bluetooth Portable Speaker', 'bluetooth-portable-speaker', 'Take your music anywhere with this waterproof Bluetooth speaker. 20-hour battery, 360-degree sound, and built-in microphone for calls. Perfect for outdoor adventures.', 'Waterproof Bluetooth speaker with 360-degree sound', 79.00, 99.00, 'SP-BT-004', 200, (SELECT id FROM categories WHERE slug = 'audio'), 'SoundMax', '["https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/2519005/pexels-photo-2519005.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["speaker", "bluetooth", "portable", "waterproof"]', false, true, 4.5, 156),

('Wireless Charging Pad', 'wireless-charging-pad', 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek minimalist design with LED indicator. Charge your phone up to 50% faster.', 'Fast wireless charger with sleek design', 39.00, 59.00, 'WC-PAD-005', 300, (SELECT id FROM categories WHERE slug = 'smartphones'), 'ChargeX', '["https://images.pexels.com/photos/4512324/pexels-photo-4512324.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["wireless", "charger", "phone", "accessory"]', false, false, 4.4, 203),

-- Fashion Products
('Organic Cotton T-Shirt', 'organic-cotton-tshirt', 'Soft, sustainable, and stylish organic cotton t-shirt. Available in multiple colors. Made from 100% GOTS certified organic cotton. Machine washable.', 'Sustainable organic cotton t-shirt', 45.00, 60.00, 'TS-ORG-006', 250, (SELECT id FROM categories WHERE slug = 'fashion'), 'EcoWear', '["https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/16560/jacket-unsplash.jpg?auto=compress&cs=tinysrgb&w=600"]', '["tshirt", "organic", "sustainable", "clothing"]', true, false, 4.7, 203),

('Minimalist Leather Backpack', 'minimalist-leather-backpack', 'Handcrafted genuine leather backpack with padded laptop compartment. Water-resistant lining, multiple pockets, and adjustable straps. Perfect for work or travel.', 'Premium leather backpack with laptop compartment', 149.00, 199.00, 'BP-ML-007', 75, (SELECT id FROM categories WHERE slug = 'fashion'), 'UrbanCarry', '["https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600", "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["backpack", "leather", "laptop", "travel"]', true, true, 4.9, 156),

-- Home & Living
('Smart LED Floor Lamp', 'smart-led-floor-lamp', 'Modern floor lamp with smart color control. Voice-activated, scheduled lighting, and 16 million colors. Energy-efficient LED technology with 25,000 hour lifespan.', 'Smart floor lamp with 16M colors', 89.00, 129.00, 'SL-FL-008', 120, (SELECT id FROM categories WHERE slug = 'home-living'), 'LumiSmart', '["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["lamp", "smart home", "LED", "lighting"]', false, true, 4.3, 89),

('Memory Foam Pillow Set', 'memory-foam-pillow-set', 'Premium memory foam pillow set (2 pack). Ergonomic design for optimal neck support. Hypoallergenic, dust mite resistant, and machine washable cover.', 'Ergonomic memory foam pillow set', 59.00, 79.00, 'PF-MF-009', 180, (SELECT id FROM categories WHERE slug = 'home-living'), 'ComfortRest', '["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["pillow", "memory foam", "bedding", "sleep"]', false, false, 4.6, 134),

-- Sports & Outdoors
('Yoga Mat Premium', 'yoga-mat-premium', 'Non-slip premium yoga mat with alignment lines. 6mm thick for extra comfort, eco-friendly TPE material. Includes carrying strap. Perfect for yoga and Pilates.', 'Premium non-slip eco-friendly yoga mat', 49.00, 69.00, 'YM-PR-010', 200, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), 'ZenFit', '["https://images.pexels.com/photos/3821393/pexels-photo-3821393.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["yoga", "exercise", "fitness", "mat"]', true, false, 4.8, 178),

('Insulated Water Bottle', 'insulated-water-bottle', 'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity, BPA-free, and includes two lids.', '24-hour cold, 12-hour hot insulation', 35.00, 45.00, 'WB-INS-011', 350, (SELECT id FROM categories WHERE slug = 'sports-outdoors'), 'HydroMax', '["https://images.pexels.com/photos/4114953/pexels-photo-4114953.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["water bottle", "insulated", "hydration", "sports"]', false, true, 4.7, 245),

-- Beauty
('Natural Face Serum', 'natural-face-serum', 'Anti-aging face serum with vitamin C and hyaluronic acid. Reduces fine lines, brightens skin, and improves texture. 98% natural ingredients, cruelty-free.', 'Vitamin C anti-aging serum', 42.00, 55.00, 'FS-NAT-012', 165, (SELECT id FROM categories WHERE slug = 'beauty'), 'GlowNatural', '["https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["serum", "skincare", "vitamin C", "anti-aging"]', true, true, 4.5, 98),

-- Books
('The Art of Mindfulness', 'art-of-mindfulness-book', 'A comprehensive guide to mindfulness practices for daily life. Includes meditation techniques, stress management, and self-reflection exercises. Hardcover edition.', 'Guide to mindfulness and meditation', 24.00, 32.00, 'BK-MF-013', 180, (SELECT id FROM categories WHERE slug = 'books'), 'WellnessPress', '["https://images.pexels.com/photos/1029140/pexels-photo-1029140.jpeg?auto=compress&cs=tinysrgb&w=600"]', '["book", "mindfulness", "wellness", "self-help"]', false, false, 4.6, 87);

-- Insert Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, starts_at, expires_at) VALUES
('WELCOME10', '10% off your first order', 'percentage', 10.00, 50.00, 50.00, 1000, now(), now() + interval '1 year'),
('SAVE20', '20% off orders over $100', 'percentage', 20.00, 100.00, 100.00, 500, now(), now() + interval '6 months'),
('FLAT25', '$25 off orders over $150', 'fixed', 25.00, 150.00, 25.00, 300, now(), now() + interval '3 months'),
('FREESHIP', 'Free shipping on orders over $75', 'fixed', 5.00, 75.00, 5.00, null, now(), now() + interval '1 year');
