# Hafsa Naeem — Professional Portfolio Website
**Target Role:** Aspiring IT Professional | Software Candidate  
**Assessment:** Portfolio Website Challenge  
**Contact:** [Hfsanaeem3@gmail.com](mailto:Hfsanaeem3@gmail.com)  
**Theme:** Light Theme Only (Pristine Daylight, Executive Navy & Ice-Blue Palette)

---

## 1. Project Overview

This is the official personal portfolio website for **Hafsa Naeem**, engineered as a responsive, accessible, single-page showcase tailored specifically for **General IT and Software** opportunities. 

The website bridges Hafsa's academic background in **MBA Finance (Master of Business Administration, 2025)** and corporate experience in **Human Resources at Alhamrah Fabrics** with her active transition into modern frontend web development (**HTML5, CSS3, JavaScript, Git, and GitHub**).

### Core Highlights:
- **100% Light Theme:** Compliant with assessment core rules prohibiting dark mode or dark toggles.
- **Bento Grid Architecture:** Clean, modern cards presenting About Me, Skills & Tools, Corporate Experience, Featured Projects, Process/Workflow, and Hiring Contact.
- **Genuine Project Evidence:** Detailed showcase of the instructor-guided **NexDrive Flash Storage (USB Company Website)** practice project with real screenshots and technical breakdowns.
- **Accessible & Responsive:** Fluid behavior across mobile, tablet, and wide desktop screens with zero horizontal overflow, visible focus indicators, and semantic HTML5.
- **Zero Heavy Frameworks:** Pure semantic HTML5, modern CSS3 custom properties, and vanilla ES6+ JavaScript.

---

## 2. Technology Stack

- **Markup:** Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `figure`, `footer`)
- **Styles:** Modern CSS3 (CSS Grid, Flexbox, CSS Custom Properties, GPU-accelerated Keyframes, Media Queries)
- **Scripting:** Vanilla JavaScript ES6+ (No external dependencies, No jQuery, No Bootstrap)
- **Visual Assets:** High-resolution vector graphics (SVG) and optimized JPEG/PNG project captures
- **Typography:** Google Fonts (`Plus Jakarta Sans`, `Caveat`, `JetBrains Mono`) with local system fallbacks

---

## 3. Project File Structure

```text
hafsa-naeem-portfolio/
├── index.html                  # Master Single-Page Portfolio
├── css/
│   └── style.css               # Centralized stylesheet (Light theme tokens, Bento Grid, Responsive rules)
├── js/
│   └── main.js                 # Vanilla JS (Modal controller, toast copy, sticky header, mobile nav)
├── images/
│   ├── ui/
│   │   ├── hero-workspace.svg          # 3D laptop, code emblem & desk accessories artwork
│   │   ├── botanical-branch-blue.svg   # Subtle azure & navy leaf decorative flourish
│   │   ├── botanical-branch.svg        # Purple branch variant
│   │   ├── building-modern.svg         # Modern architectural corporate office illustration
│   │   └── building-illustration.svg   # Classic vector office illustration
│   ├── reference/
│   │   ├── design-example.png          # Reference design mockup (Bento style)
│   │   └── design-example-v2.png       # Reference design mockup (Daylight Navy & Ice-Blue)
│   └── projects/
│       └── usb/                        # Genuine USB company website assets
│           ├── hero-hardware-showcase.jpg
│           ├── facility-hardware.jpg
│           ├── laser-engraving-custom.jpg
│           ├── hero/hero-showcase.png
│           └── products/               # Hardware product photos (Apex, Duolink, Swivel, etc.)
├── verify-assets.js            # Node.js automated asset existence and path verification script
├── test-server.js              # Local test script
├── README.md                   # Complete technical manual & run guide
├── DESIGN_DECISION_LOG.md      # Completed 10-section thought process & decision log
└── SELF_REVIEW.md              # Cross-device testing, accessibility & quality audit
```

---

## 4. How to Run Locally

### Option A: Direct Browser Execution (Fastest & Zero Setup)
Double-click `index.html` in Windows File Explorer, or right-click `index.html` and choose **Open with** &rarr; **Google Chrome / Microsoft Edge / Firefox**.

### Option B: Local Static Server via Node.js
If you prefer running a local static HTTP server:
```powershell
# Navigate to the portfolio folder:
cd "C:\Users\Mr Laptop\.gemini\antigravity\scratch\hafsa-naeem-portfolio"

# Run with npx serve or any static server:
npx serve .
# Or run with Node http-server:
npx http-server -p 3000
```
Then open `http://localhost:3000` in your web browser.

---

## 5. Deployment Guide

To deploy this website to a live public URL for assignment submission:

### Method 1: GitHub Pages (Recommended)
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hafsa Naeem professional portfolio"
   ```
2. Create a new public repository on GitHub named `hafsa-naeem-portfolio`.
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/hafsa-naeem-portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, navigate to **Settings** &rarr; **Pages**, select the `main` branch as the source, and click **Save**. Your live portfolio will be available at `https://<your-username>.github.io/hafsa-naeem-portfolio/`.

### Method 2: Vercel / Netlify (Instant Drag-and-Drop)
1. Sign in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Drag and drop the `hafsa-naeem-portfolio` folder directly into the Netlify or Vercel dashboard.
3. Your website will be deployed instantly with a live, publicly accessible `.vercel.app` or `.netlify.app` URL with automatic SSL.

---

## 6. Verification and Audit

Run the built-in automated audit script to verify that all assets and paths exist on disk:
```powershell
node verify-assets.js
```
Expected output:
```text
--- AUDITING HAFSA NAEEM PORTFOLIO ASSETS ---
[PASS] images/ui/hero-workspace.svg => Found
[PASS] images/ui/botanical-branch-blue.svg => Found
[PASS] images/ui/building-modern.svg => Found
[PASS] images/projects/usb/hero-hardware-showcase.jpg => Found
[PASS] images/projects/usb/facility-hardware.jpg => Found
[PASS] images/projects/usb/laser-engraving-custom.jpg => Found
[PASS] images/projects/usb/hero/hero-showcase.png => Found
[PASS] js/main.js => Found
[PASS] css/style.css => Found
---------------------------------------------
OVERALL ASSET AUDIT STATUS: ALL ASSETS VERIFIED
```
