# NexDrive Flash Storage Solutions — Static Company Website

A complete, production-ready, professional B2B static company profile and product catalog website for a USB flash drive supplier.

Designed with an ultra-premium **Luxury Obsidian Carbon, Dark Titanium & Cyber Amber** visual aesthetic. Engineered with **pure semantic HTML5 and modern CSS3**, containing **zero JavaScript dependencies**, zero external libraries, and no backend frameworks.

---

## 1. Project Overview

- **Business Domain:** Commercial USB Flash Storage, OEM Memory Supply, Corporate Custom Branded Flash Drives.
- **Website Purpose:** Corporate presence, technical hardware specification catalog, and B2B quotation inquiries.
- **Visual Palette:** Luxury Obsidian Carbon (`#06080D`), Deep Slate (`#141A29`), Burnished Gold / Cyber Amber (`#F59E0B`), and Emerald Matrix (`#10B981`) — departing completely from simple blue and white.
- **Animation System:** Pure CSS3 hardware animations and SVG keyframe dynamics (3D floating levitation, rotating swivel arm, magnetic cap snap, flip-out chip, metallic light sheen sweep, live data transfer benchmark stream, and pulsing activity LEDs).
- **Architecture:** 100% Static files deployable to any web server or static hosting provider.
- **E-Commerce Notice:** This is strictly an informational and technical profile website. It contains **no online purchasing, no cart, no payment gateways, no customer accounts, and no live inventory tracking**. All transactions and quotes occur via direct corporate communication (Email, Phone, Quotation Desk).

---

## 2. Technology Stack

- **HTML5:** Semantic markup (`header`, `nav`, `main`, `section`, `article`, `table`, `footer`).
- **CSS3:** Native CSS Grid, Flexbox, CSS Custom Properties (`:root`), Responsive Media Queries, and CSS-only interactive components.
- **Pure CSS Navigation:** Responsive mobile hamburger navigation using pure CSS checkbox state without any JavaScript.
- **Vector Graphics:** Self-contained high-detail SVG assets (`.svg`) with embedded CSS `@keyframes` for pixel-crisp rendering and smooth GPU-accelerated 60fps animations across all screen resolutions without external CDN latency.
- **Zero Dependencies:** No Bootstrap, no Tailwind, no jQuery, no React, no NPM build steps.

---

## 3. Project File Structure

```text
usb-company-website/
├── index.html                      # Homepage: 3D Hero Levitation, Real-Time Benchmark Visualizer, Featured Drives, Categories, CTA
├── about.html                      # Corporate Profile: Mission, Operating Principles, QA Testing Policies
├── products.html                   # Master Product Catalog: Categorized Grid, Anchor Jumps, Specs Summary
├── why-us.html                     # Supplier Advantages: QA Integrity, Custom Branding, 4-Step Procurement
├── contact.html                    # Contact Desk: Direct channels, Quotation Checklist, Prototype Form
├── products/                       # Dedicated Product Specification Detail Pages
│   ├── usb-apex-titanium.html      # Model USB-M100 (Unibody Zinc-Alloy Flash Drive with Amber LED)
│   ├── usb-duolink-pro.html        # Model USB-D200 (Dual USB-C & USB-A OTG Drive with Rotating Shield)
│   ├── usb-orbit-swivel.html       # Model USB-S300 (Classic Capless 360° Swivel Drive with Oscillating Arm)
│   ├── usb-cardslim-executive.html # Model USB-C400 (Ultra-Slim 2.2mm Wafer Credit Card Drive with Flip-Out Chip)
│   ├── usb-securevault-key.html    # Model USB-K500 (IPX7 Waterproof Solid Key Drive with Water Pulse)
│   └── usb-ecobamboo-wood.html     # Model USB-E600 (Sustainable FSC Bamboo Wooden Drive with Magnetic Dock)
├── css/
│   └── style.css                   # Master CSS3 Stylesheet with centralized CSS Custom Properties
├── images/
│   ├── logo.svg                    # Titanium Wordmark & Geometric Gold USB Trident Emblem
│   ├── hero/
│   │   ├── hero-usb-showcase.svg   # Multi-drive animated 3D composition with tech badges & data stream
│   │   └── factory-tech-banner.svg # SMT PCB assembly, IC controller testing, and laser engraving station
│   └── products/                   # High-detail animated SVG product illustrations
│       ├── usb-apex-titanium.svg   # Titanium unibody with sweeping light sheen and pulsing LED
│       ├── usb-duolink-pro.svg     # Dual OTG drive with rotating protective shield
│       ├── usb-orbit-swivel.svg    # Capless drive with 360-degree oscillating swivel arm
│       ├── usb-cardslim-executive.svg # Credit card wafer drive with flip-out connector animation
│       ├── usb-securevault-key.svg # Waterproof key drive with simulated immersion wave ripples
│       └── usb-ecobamboo-wood.svg  # Carbonized bamboo drive with magnetic cap dock/snap motion
├── assets/
│   └── fonts/                      # Dedicated directory for local font assets if required
├── robots.txt                      # Search engine crawler directives
├── sitemap.xml                     # Search engine XML sitemap of all pages
└── README.md                       # Complete documentation and maintenance manual
```

---

## 4. How to Open and Preview the Website Locally

Because this project is built entirely on static HTML5 and CSS3:

1. **Direct Browser Execution:**
   - Double-click `index.html` in your file explorer, or right-click `index.html` and select **Open with** &rarr; **Google Chrome / Microsoft Edge / Mozilla Firefox**.
2. **Local Static Server (Optional):**
   - If you prefer running an HTTP server (e.g. using Python or Node):
     ```bash
     # Using Python 3:
     python -m http.server 8080
     # Then open http://localhost:8080 in your browser
     ```

---

## 5. Maintenance & Customization Guide

### 5.1 Updating Company Information
Search and replace the placeholder text across the HTML files:
- **Company Name:** Replace `NexDrive [Company Name Placeholder]` with your legal entity name.
- **Logo:** Replace or edit `images/logo.svg` or update the `<img src="images/logo.svg">` reference in the `<header>` and `<footer>` sections of each HTML file.

### 5.2 Updating Contact Information
Open `contact.html` and each page's `<footer>`:
- **Sales Email:** Replace `sales@example.com` with your verified sales email in all `mailto:` links.
- **Telephone:** Replace `+1 (000) 000-0000` and `tel:+10000000000` with your company's phone number.
- **Address:** Replace `[Official Corporate Address - To Be Supplied by Client]` with your registered office address.
- **WhatsApp:** Replace `https://wa.me/00000000000` with your WhatsApp Business phone link.

### 5.3 Changing the Visual Color Palette
All core colors are centralized in `css/style.css` under the `:root` pseudo-class. Edit these hex values to centrally customize the website:

```css
:root {
  /* Ultra-Premium Obsidian & Titanium Spectrum */
  --color-obsidian-950: #06080D;  /* Deepest space background */
  --color-obsidian-900: #0A0E17;  /* Master page canvas */
  --color-card-bg: #141A29;       /* Elevated hardware cards */
  --color-card-hover: #1E2840;    /* Interactive card hover */

  /* Primary Accent: Burnished Gold & Cyber Amber */
  --color-amber-gold: #F59E0B;    /* Primary gold CTA buttons and highlights */
  --color-amber-light: #FBBF24;   /* Bright gold hover */
  --color-amber-soft: rgba(245, 158, 11, 0.12); /* Subtle badge tint */

  /* Secondary Accents */
  --color-emerald-accent: #10B981;/* Verified QA status */
}
```

---

## 6. How to Add a New Product

Follow these 3 simple steps to add a new USB flash drive to your catalog:

### Step 1: Add a Product Card in `products.html`
Copy this template into the `<div id="all-models" class="product-grid">` container:

```html
<article id="category-anchor-id" class="product-card">
  <div class="product-card-media">
    <span class="product-card-badge">Titanium Series</span>
    <img src="images/products/your-image.svg" alt="Product Name" width="600" height="450" loading="lazy">
  </div>
  <div class="product-card-body">
    <div class="product-meta-header">
      <span class="product-model-code">USB-XXXX</span>
      <span class="product-category-name">Category Name</span>
    </div>
    <h2 class="product-card-title">
      <a href="products/usb-new-model.html">Product Name</a>
    </h2>
    <p class="product-card-desc">
      Short concise description highlighting construction material, design feature, and recommended usage.
    </p>
    <ul class="product-specs-list">
      <li class="product-spec-row">
        <span class="spec-label">Capacities:</span>
        <span class="spec-val">16GB, 32GB, 64GB, 128GB</span>
      </li>
      <li class="product-spec-row">
        <span class="spec-label">Interface:</span>
        <span class="spec-val">USB 3.2 Gen 1</span>
      </li>
      <li class="product-spec-row">
        <span class="spec-label">Connector:</span>
        <span class="spec-val">Standard USB Type-A</span>
      </li>
      <li class="product-spec-row">
        <span class="spec-label">Housing Material:</span>
        <span class="spec-val">Aluminum Alloy</span>
      </li>
    </ul>
    <div class="product-card-footer">
      <a href="products/usb-new-model.html" class="btn btn-primary">View Full Specifications</a>
    </div>
  </div>
</article>
```

### Step 2: Create the Dedicated Product Page in `products/`
Duplicate an existing detail page (such as `products/usb-apex-titanium.html`) and rename it:
1. Update `<title>` and `<meta name="description">`.
2. Update the breadcrumb label in the `<ol class="breadcrumbs-list">`.
3. Update the `<img>` src and alt attributes.
4. Fill in the semantic `<table>` with the new product's specifications.

### Step 3: Update `sitemap.xml` and Footers
Add the new product URL to `sitemap.xml` and include its link in the footer USB models list across the HTML files.

---

## 7. Placeholder Checklist Before Production Launch

| Item | Placeholder Value | Action Required |
| :--- | :--- | :--- |
| **Company Legal Name** | `NexDrive [Company Name Placeholder]` | Replace with legal registered company name |
| **Sales Email** | `sales@example.com` | Update to official sales email in `mailto:` links |
| **Telephone Desk** | `+1 (000) 000-0000` | Replace with verified corporate phone number |
| **Headquarters Address** | `[Corporate Address Placeholder]` | Update with physical corporate office address |
| **WhatsApp Direct** | `https://wa.me/00000000000` | Update with official WhatsApp Business number |
| **Production Domain** | `https://www.example.com` | Update in `robots.txt` and `sitemap.xml` |
| **Illustrative Products** | 6 sample USB models | Replace or update with your verified inventory specifications |

---

## 8. Deployment to Static Hosting

The website can be hosted on any static hosting platform with zero configuration:

- **GitHub Pages:** Commit files to a repository and enable GitHub Pages on the `main` branch.
- **Cloudflare Pages / Netlify / Vercel:** Point the project to the repository with no build command (`Build command: none`, `Publish directory: .`).
- **AWS S3 / Apache / Nginx:** Upload all files directly to the web root (`public_html` or `/var/www/html`).
