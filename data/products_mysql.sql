-- ==============================================================================
-- NexDrive USB Storage Solutions - MySQL Database Schema & Seed Data
-- Database: usb_company
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `usb_company` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `usb_company`;

-- Table structure for table `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `model_code` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `capacity` VARCHAR(255) DEFAULT NULL,
  `price` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `availability` VARCHAR(50) DEFAULT 'In Stock',
  `category` VARCHAR(100) DEFAULT 'Standard USB',
  `read_speed` VARCHAR(100) DEFAULT NULL,
  `interface` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping initial seed products
INSERT INTO `products` (`name`, `model_code`, `image`, `capacity`, `price`, `description`, `availability`, `category`, `read_speed`, `interface`) VALUES
('Apex Titanium Flash Drive', 'USB-M100', 'images/products/usb-apex-titanium.svg', '16GB, 32GB, 64GB, 128GB, 256GB', '$4.20 - $18.50 / unit', 'Rugged zinc-aluminum alloy monocoque casing with gunmetal titanium finish. Dual-channel high-retention NAND designed for mission-critical enterprise deployment.', 'In Stock', 'Titanium Metal', 'Up to 120 MB/s', 'USB 3.2 Gen 1'),
('DuoLink Pro Dual OTG Drive', 'USB-D200', 'images/products/usb-duolink-pro.svg', '32GB, 64GB, 128GB, 256GB, 512GB', '$5.80 - $28.00 / unit', 'Reversible dual-interface swivel drive with USB Type-C and USB-A plugs. Instant plug-and-play cross-compatibility between smartphones, modern laptops, and legacy terminals.', 'In Stock', 'Dual USB-C OTG', 'Up to 150 MB/s', 'USB-C & USB 3.1 Gen 1'),
('Orbit Swivel Flash Drive', 'USB-S300', 'images/products/usb-orbit-swivel.svg', '8GB, 16GB, 32GB, 64GB, 128GB', '$2.90 - $11.50 / unit', 'The corporate industry standard capless 360-degree rotational design featuring a protective aluminum swivel clip and soft-touch body. Large surface area for laser engraving and screen printing.', 'In Stock', 'Capless Swivel', 'Up to 90 MB/s', 'USB 3.0 / USB 2.0'),
('CardSlim Executive Wafer Drive', 'USB-C400', 'images/products/usb-cardslim-executive.svg', '16GB, 32GB, 64GB, 128GB', '$3.40 - $12.80 / unit', 'Ultra-slim 2.2mm form factor with flip-out USB connector styled identically to a standard business card. Fits perfectly in wallets with full-bleed double-sided photographic UV imprint area.', 'Made to Order', 'Credit Card Wafer', 'Up to 80 MB/s', 'USB 3.0 Monolithic UDP'),
('SecureVault Key Flash Drive', 'USB-K500', 'images/products/usb-securevault-key.svg', '32GB, 64GB, 128GB, 256GB', '$6.50 - $22.00 / unit', 'IPX7 waterproof monolithic UDP chip architecture shaped like a standard key for everyday keyring carry. Scratch-resistant, shockproof, and ideal for confidential file distribution.', 'In Stock', 'Waterproof Key', 'Up to 140 MB/s', 'USB 3.2 Gen 1 UDP'),
('EcoBamboo Wood Drive', 'USB-E600', 'images/products/usb-ecobamboo-wood.svg', '16GB, 32GB, 64GB, 128GB', '$4.90 - $14.50 / unit', 'FSC-certified organic bamboo wood housing with magnetic cap closure. Sustainable natural aesthetic tailored for eco-conscious corporate gifting, environmental summits, and ESG initiatives.', 'Bulk Only', 'Eco Wood', 'Up to 100 MB/s', 'USB 3.0 Interface');
