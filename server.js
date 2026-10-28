// ==============================================================================
// NexDrive USB Products Management Backend Server
// Zero-Dependency Pure Node.js + Native SQLite Architecture
// ==============================================================================

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_DIR = path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const DB_PATH = path.join(DB_DIR, 'products.db');

// Ensure data and uploads directories exist
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialize SQLite Database
const db = new DatabaseSync(DB_PATH);

// Setup Products Table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model_code TEXT,
    image TEXT,
    capacity TEXT,
    price TEXT,
    description TEXT,
    availability TEXT DEFAULT 'In Stock',
    category TEXT DEFAULT 'Standard USB',
    read_speed TEXT,
    interface TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default products if database is newly initialized
const countRow = db.prepare('SELECT COUNT(*) AS count FROM products').get();
if (countRow.count === 0) {
  const seedProducts = [
    {
      name: 'Apex Titanium Flash Drive',
      model_code: 'USB-M100',
      image: 'images/products/usb-apex-titanium.svg',
      capacity: '16GB, 32GB, 64GB, 128GB, 256GB',
      price: '$4.20 - $16.50 / unit',
      description: 'Heavy-duty unibody zinc-alloy flash drive engineered for maximum durability, heat dissipation, and corporate keyring portability. Resistant to water, pressure, and dust.',
      availability: 'In Stock',
      category: 'Titanium Metal',
      read_speed: 'Up to 130 MB/s',
      interface: 'USB 3.2 Gen 1 (Type-A)'
    },
    {
      name: 'DuoLink Pro Dual OTG Drive',
      model_code: 'USB-D200',
      image: 'images/products/usb-duolink-pro.svg',
      capacity: '32GB, 64GB, 128GB, 256GB',
      price: '$5.80 - $21.00 / unit',
      description: 'Versatile 2-in-1 flash drive featuring reversible USB Type-C and standard USB Type-A connectors for seamless file transfer between smartphones, MacBooks, tablets, and Windows PCs.',
      availability: 'In Stock',
      category: 'Dual USB-C / OTG',
      read_speed: 'Up to 150 MB/s',
      interface: 'Dual USB-C & USB-A 3.2'
    },
    {
      name: 'Orbit Swivel Flash Drive',
      model_code: 'USB-S300',
      image: 'images/products/usb-orbit-swivel.svg',
      capacity: '8GB, 16GB, 32GB, 64GB, 128GB',
      price: '$2.90 - $11.50 / unit',
      description: 'The corporate industry standard capless 360-degree rotational design featuring a protective aluminum swivel clip and soft-touch body. Large surface area for laser engraving and screen printing.',
      availability: 'In Stock',
      category: 'Capless Swivel',
      read_speed: 'Up to 90 MB/s',
      interface: 'USB 3.0 / USB 2.0'
    },
    {
      name: 'CardSlim Executive Wafer Drive',
      model_code: 'USB-C400',
      image: 'images/products/usb-cardslim-executive.svg',
      capacity: '16GB, 32GB, 64GB, 128GB',
      price: '$3.40 - $12.80 / unit',
      description: 'Ultra-slim 2.2mm form factor with flip-out USB connector styled identically to a standard business card. Fits perfectly in wallets with full-bleed double-sided photographic UV imprint area.',
      availability: 'Made to Order',
      category: 'Credit Card Wafer',
      read_speed: 'Up to 80 MB/s',
      interface: 'USB 3.0 Monolithic UDP'
    },
    {
      name: 'SecureVault Key Flash Drive',
      model_code: 'USB-K500',
      image: 'images/products/usb-securevault-key.svg',
      capacity: '32GB, 64GB, 128GB, 256GB',
      price: '$6.50 - $22.00 / unit',
      description: 'IPX7 waterproof monolithic UDP chip architecture shaped like a standard key for everyday keyring carry. Scratch-resistant, shockproof, and ideal for confidential file distribution.',
      availability: 'In Stock',
      category: 'Waterproof Key',
      read_speed: 'Up to 140 MB/s',
      interface: 'USB 3.2 Gen 1 UDP'
    },
    {
      name: 'EcoBamboo Wood Drive',
      model_code: 'USB-E600',
      image: 'images/products/usb-ecobamboo-wood.svg',
      capacity: '16GB, 32GB, 64GB, 128GB',
      price: '$4.90 - $14.50 / unit',
      description: 'FSC-certified organic bamboo wood housing with magnetic cap closure. Sustainable natural aesthetic tailored for eco-conscious corporate gifting, environmental summits, and ESG initiatives.',
      availability: 'Bulk Only',
      category: 'Eco Wood',
      read_speed: 'Up to 100 MB/s',
      interface: 'USB 3.0 Interface'
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO products (name, model_code, image, capacity, price, description, availability, category, read_speed, interface)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of seedProducts) {
    insertStmt.run(
      item.name,
      item.model_code,
      item.image,
      item.capacity,
      item.price,
      item.description,
      item.availability,
      item.category,
      item.read_speed,
      item.interface
    );
  }
  console.log(`[Database] Seeded ${seedProducts.length} default products.`);
}

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

// Helper: parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 25 * 1024 * 1024) { // 25MB max
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: Serve Static File with Extensionless HTML resolution
function serveStatic(req, res, filePath) {
  // Prevent path traversal
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  const streamFile = (targetFile) => {
    fs.stat(targetFile, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404 Not Found</h1><p>Requested file does not exist.</p>');
      }

      const ext = path.extname(targetFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(targetFile).pipe(res);
    });
  };

  fs.stat(safePath, (err, stats) => {
    // 1. Direct file match
    if (!err && stats.isFile()) {
      return streamFile(safePath);
    }

    // 2. Extensionless .html fallback (e.g. /about -> /about.html, /products -> /products.html)
    const htmlCandidate = safePath + '.html';
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      return streamFile(htmlCandidate);
    }

    // 3. Directory index fallback (e.g. /admin/ -> /admin/index.html)
    if (!err && stats.isDirectory()) {
      const indexCandidate = path.join(safePath, 'index.html');
      if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
        return streamFile(indexCandidate);
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p>Requested file does not exist.</p>');
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ============================================================================
  // REST API Endpoints
  // ============================================================================

  // 1. GET /api/products (List with search and filter)
  if (method === 'GET' && pathname === '/api/products') {
    const q = (parsedUrl.searchParams.get('q') || '').trim();
    const availability = (parsedUrl.searchParams.get('availability') || '').trim();
    const category = (parsedUrl.searchParams.get('category') || '').trim();

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (name LIKE ? OR model_code LIKE ? OR description LIKE ? OR capacity LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }
    if (availability && availability !== 'All') {
      sql += ' AND availability = ?';
      params.push(availability);
    }
    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY id DESC';
    const products = db.prepare(sql).all(...params);
    return sendJson(res, 200, { success: true, count: products.length, products });
  }

  // 2. GET /api/products/:id (Get single product)
  const idMatch = pathname.match(/^\/api\/products\/(\d+)$/);
  if (method === 'GET' && idMatch) {
    const id = parseInt(idMatch[1], 10);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return sendJson(res, 404, { success: false, error: 'Product not found' });
    }
    return sendJson(res, 200, { success: true, product });
  }

  // 3. POST /api/products (Create product)
  if (method === 'POST' && pathname === '/api/products') {
    try {
      const data = await parseBody(req);
      if (!data.name || !data.name.trim()) {
        return sendJson(res, 400, { success: false, error: 'Product name is required.' });
      }

      const stmt = db.prepare(`
        INSERT INTO products (
          name, model_code, image, capacity, price, price_pkr,
          description, availability, category, read_speed, write_speed,
          interface, material, dimensions, weight, warranty,
          features, stock_quantity, min_order_qty, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      const pkr = parseFloat(data.price_pkr) || 1200;
      const result = stmt.run(
        data.name.trim(),
        data.model_code ? data.model_code.trim() : `USB-N${Math.floor(100 + Math.random() * 900)}`,
        data.image ? data.image.trim() : 'images/products/usb-apex-titanium.svg',
        data.capacity ? data.capacity.trim() : '16GB, 32GB, 64GB',
        data.price ? data.price.trim() : `₨ ${pkr.toLocaleString()} / unit`,
        pkr,
        data.description ? data.description.trim() : '',
        data.availability ? data.availability.trim() : 'In Stock',
        data.category ? data.category.trim() : 'Standard USB',
        data.read_speed ? data.read_speed.trim() : 'Up to 100 MB/s',
        data.write_speed ? data.write_speed.trim() : 'Up to 45 MB/s',
        data.interface ? data.interface.trim() : 'USB 3.0',
        data.material ? data.material.trim() : 'Metal / Zinc Alloy',
        data.dimensions ? data.dimensions.trim() : '48 × 12 × 4.6 mm',
        data.weight ? data.weight.trim() : '15g',
        data.warranty ? data.warranty.trim() : '5-Year Enterprise Replacement Warranty',
        data.features ? data.features.trim() : '',
        parseInt(data.stock_quantity, 10) || 1000,
        parseInt(data.min_order_qty, 10) || 25
      );

      const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
      return sendJson(res, 201, { success: true, product: newProduct });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. PUT /api/products/:id (Update product)
  if (method === 'PUT' && idMatch) {
    try {
      const id = parseInt(idMatch[1], 10);
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!existing) {
        return sendJson(res, 404, { success: false, error: 'Product not found' });
      }

      const data = await parseBody(req);
      const stmt = db.prepare(`
        UPDATE products
        SET name = ?,
            model_code = ?,
            image = ?,
            capacity = ?,
            price = ?,
            price_pkr = ?,
            description = ?,
            availability = ?,
            category = ?,
            read_speed = ?,
            write_speed = ?,
            interface = ?,
            material = ?,
            dimensions = ?,
            weight = ?,
            warranty = ?,
            features = ?,
            stock_quantity = ?,
            min_order_qty = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const pkr = data.price_pkr !== undefined ? parseFloat(data.price_pkr) : existing.price_pkr;

      stmt.run(
        data.name !== undefined ? data.name.trim() : existing.name,
        data.model_code !== undefined ? data.model_code.trim() : existing.model_code,
        data.image !== undefined ? data.image.trim() : existing.image,
        data.capacity !== undefined ? data.capacity.trim() : existing.capacity,
        data.price !== undefined ? data.price.trim() : existing.price,
        pkr,
        data.description !== undefined ? data.description.trim() : existing.description,
        data.availability !== undefined ? data.availability.trim() : existing.availability,
        data.category !== undefined ? data.category.trim() : existing.category,
        data.read_speed !== undefined ? data.read_speed.trim() : existing.read_speed,
        data.write_speed !== undefined ? data.write_speed.trim() : existing.write_speed,
        data.interface !== undefined ? data.interface.trim() : existing.interface,
        data.material !== undefined ? data.material.trim() : existing.material,
        data.dimensions !== undefined ? data.dimensions.trim() : existing.dimensions,
        data.weight !== undefined ? data.weight.trim() : existing.weight,
        data.warranty !== undefined ? data.warranty.trim() : existing.warranty,
        data.features !== undefined ? data.features.trim() : existing.features,
        data.stock_quantity !== undefined ? parseInt(data.stock_quantity, 10) : existing.stock_quantity,
        data.min_order_qty !== undefined ? parseInt(data.min_order_qty, 10) : existing.min_order_qty,
        id
      );

      const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      return sendJson(res, 200, { success: true, product: updatedProduct });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 5. DELETE /api/products/:id (Delete product)
  if (method === 'DELETE' && idMatch) {
    try {
      const id = parseInt(idMatch[1], 10);
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!existing) {
        return sendJson(res, 404, { success: false, error: 'Product not found' });
      }

      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      return sendJson(res, 200, { success: true, message: `Product ${id} deleted successfully.` });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 6. POST /api/upload (Image Upload: base64 payload)
  if (method === 'POST' && pathname === '/api/upload') {
    try {
      const data = await parseBody(req);
      if (!data.data) {
        return sendJson(res, 400, { success: false, error: 'No image data provided.' });
      }

      // Format: data:image/png;base64,xxxx
      const matches = data.data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      let ext = 'png';
      let buffer;

      if (matches) {
        ext = matches[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(data.data, 'base64');
      }

      const filename = `usb-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);

      return sendJson(res, 200, {
        success: true,
        url: `/uploads/${filename}`,
        filename
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 7. GET /api/stats (Dashboard Metrics)
  if (method === 'GET' && pathname === '/api/stats') {
    const total = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
    const inStock = db.prepare("SELECT COUNT(*) AS count FROM products WHERE availability = 'In Stock'").get().count;
    const madeToOrder = db.prepare("SELECT COUNT(*) AS count FROM products WHERE availability = 'Made to Order'").get().count;
    const bulkOnly = db.prepare("SELECT COUNT(*) AS count FROM products WHERE availability = 'Bulk Only'").get().count;
    const outOfStock = db.prepare("SELECT COUNT(*) AS count FROM products WHERE availability = 'Out of Stock'").get().count;
    const categories = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();

    return sendJson(res, 200, {
      success: true,
      stats: {
        total,
        inStock,
        madeToOrder,
        bulkOnly,
        outOfStock,
        categories
      }
    });
  }

  // ============================================================================
  // Static Files & Clean URL Routing
  // ============================================================================

  // 1. Clean URL redirect: If requested with .html, 301 redirect to extensionless URL
  if (pathname.endsWith('.html')) {
    let clean = pathname.slice(0, -5);
    if (clean === '/index' || clean === '') {
      clean = '/';
    } else if (clean === '/admin/index') {
      clean = '/admin/';
    } else if (clean === '/products/index') {
      clean = '/products';
    }
    const search = parsedUrl.search || '';
    res.writeHead(301, { 'Location': clean + search });
    return res.end();
  }

  // 2. Trailing slash normalization
  // Admin: /admin -> /admin/
  if (pathname === '/admin') {
    res.writeHead(301, { 'Location': '/admin/' + (parsedUrl.search || '') });
    return res.end();
  }
  // Products catalog: /products/ -> /products
  if (pathname === '/products/') {
    res.writeHead(301, { 'Location': '/products' + (parsedUrl.search || '') });
    return res.end();
  }

  // 3. Serve Admin SPA
  if (pathname === '/admin/' || pathname === '/admin/index.html') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'index.html'));
  }

  // Explicit mappings for admin assets whether requested as /admin/css or /css
  if (pathname === '/admin/css/admin.css' || pathname === '/css/admin.css') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'css', 'admin.css'));
  }
  if (pathname === '/admin/js/admin.js' || pathname === '/js/admin.js') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'js', 'admin.js'));
  }

  // 4. Products Catalog page (/products)
  if (pathname === '/products') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'products.html'));
  }

  // 5. Product Details page (/product)
  if (pathname === '/product') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'product.html'));
  }

  // 6. Admin Dedicated Product Edit page (/admin/product-edit)
  if (pathname === '/admin/product-edit') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'product-edit.html'));
  }

  // 7. Default file fallback
  let relativeFilePath = pathname;
  if (relativeFilePath === '/' || relativeFilePath === '') {
    relativeFilePath = '/index.html';
  }

  const resolvedPath = path.join(ROOT_DIR, relativeFilePath);
  serveStatic(req, res, resolvedPath);
});

// Start listening
server.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`  NexDrive Products Management Server is Live!`);
  console.log(`  Public Website:   http://localhost:${PORT}`);
  console.log(`  Admin Dashboard:  http://localhost:${PORT}/admin`);
  console.log(`  Products API:     http://localhost:${PORT}/api/products`);
  console.log(`  Database File:    ${DB_PATH}`);
  console.log(`=================================================================`);
});
