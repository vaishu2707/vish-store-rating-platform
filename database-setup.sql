-- Store Rating Platform Database Setup
-- Run this after creating the main schema

USE store_rating_platform;

-- Add sample stores for testing
INSERT INTO stores (name, email, address, owner_id) VALUES 
('TechMart Electronics', 'techmart@example.com', '123 Technology Street, Silicon Valley, CA 94000', NULL),
('Fresh Grocery Store', 'fresh@example.com', '456 Main Street, Downtown, NY 10001', NULL),
('Fashion Boutique', 'fashion@example.com', '789 Fashion Avenue, Style District, LA 90210', NULL),
('Coffee Corner', 'coffee@example.com', '321 Brew Street, Coffee Town, Seattle, WA 98101', NULL),
('Book Haven', 'books@example.com', '654 Library Lane, Reading City, Boston, MA 02101', NULL),
('Sports Central', 'sports@example.com', '987 Athletic Avenue, Fitness District, Miami, FL 33101', NULL),
('Beauty Salon', 'beauty@example.com', '147 Glamour Street, Beauty Plaza, Chicago, IL 60601', NULL),
('Hardware Store', 'hardware@example.com', '258 Tool Terrace, Construction Zone, Dallas, TX 75201', NULL);

-- Add sample users for testing
INSERT INTO users (name, email, password, address, role) VALUES 
('John Doe Smith Johnson', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQ5eqGStBm65xTp9EW6M4f9Oe', '123 Main Street, Anytown, USA 12345', 'user'),
('Jane Smith Wilson Brown', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQ5eqGStBm65xTp9EW6M4f9Oe', '456 Oak Avenue, Somewhere, USA 54321', 'user'),
('Store Owner Manager', 'owner@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQ5eqGStBm65xTp9EW6M4f9Oe', '789 Business Blvd, Commerce City, USA 67890', 'store_owner');

-- Add sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(2, 1, 5),  -- John rates TechMart 5 stars
(2, 2, 4),  -- John rates Fresh Grocery 4 stars
(2, 3, 3),  -- John rates Fashion Boutique 3 stars
(2, 4, 5),  -- John rates Coffee Corner 5 stars
(2, 5, 4),  -- John rates Book Haven 4 stars
(3, 1, 4),  -- Jane rates TechMart 4 stars
(3, 2, 5),  -- Jane rates Fresh Grocery 5 stars
(3, 3, 4),  -- Jane rates Fashion Boutique 4 stars
(3, 4, 3),  -- Jane rates Coffee Corner 3 stars
(3, 5, 5);  -- Jane rates Book Haven 5 stars

-- Assign a store to the store owner
UPDATE stores SET owner_id = 4 WHERE id = 1; -- TechMart Electronics

-- Display summary
SELECT 'Database setup completed!' as Status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Stores' FROM stores;
SELECT COUNT(*) as 'Total Ratings' FROM ratings;
