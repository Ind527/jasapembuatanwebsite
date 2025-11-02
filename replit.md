# SitusKita - Website Jasa Pembuatan Website

## Overview
Static HTML website for SitusKita, a professional web development services company. The website showcases services, portfolio, pricing, and contact information. **Now includes Affiliate System with Clerk Authentication and Order Tracking features** - frontend-only solutions using localStorage and Clerk for secure login.

## Project Architecture
- **Frontend**: Static HTML/CSS/JavaScript
- **Framework**: Tailwind CSS (CDN)
- **Libraries**: 
  - Three.js & Vanta.js (animated backgrounds)
  - AOS (animations on scroll)
  - Splide (carousel/slider)
  - Font Awesome (icons)
- **Server**: Node.js HTTP server for serving static files

## File Structure
```
/
├── index.html          # Homepage (with affiliate tracking)
├── about.html          # About page
├── services.html       # Services page
├── portfolio.html      # Portfolio page
├── pricing.html        # Pricing page
├── contact.html        # Contact page
├── blog.html          # Blog page
├── testimonials.html  # Testimonials page
├── affiliate.html      # Affiliate dashboard page (Clerk protected)
├── order-tracking.html # Order tracking page
├── main.js            # Main JavaScript file
├── affiliate.js       # Affiliate system logic
├── clerk-auth.js      # Clerk authentication & role-based access
├── order-tracking.js  # Order tracking system logic
├── server.js          # Node.js static file server
└── *.jpeg            # Portfolio images
```

## Setup & Configuration
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (to allow Replit proxy)
- **Cache Control**: Disabled to ensure latest changes are visible

## Recent Changes
- **2025-11-02 (Update 3)**: Enhanced Mobile/Tablet UX and Integrated Order Tracking System
  - Added logout button for mobile/tablet users in affiliate dashboard
  - Redesigned statistics cards with responsive grid (2 columns mobile, 4 desktop)
  - Added Total Revenue card to affiliate dashboard
  - Updated referral links to direct to contact form (/contact.html?ref=CODE)
  - Integrated consultation form with order tracking and affiliate system
  - Automatic tracking code generation for each order submission
  - Modal success notification showing tracking code to customers
  - Cross-page affiliate attribution using sessionStorage
  - Orders automatically credited to correct affiliate with revenue and commission tracking
  - Admin and sales dashboards auto-update with new orders from localStorage

- **2025-11-02 (Update 2)**: Added Clerk Authentication to Affiliate System
  - Integrated Clerk authentication using CDN (no build tools required)
  - Created clerk-auth.js for authentication logic and role-based access
  - Implemented Admin role (sultancisoka@gmail.com) with sales management features
  - Implemented Sales role (all other users) with personal dashboard
  - Admin features: manage sales team, view all statistics, add/remove/deactivate sales
  - Sales features: personal affiliate code, click tracking, commission tracking
  - Clerk Publishable Key: pk_test_ZHluYW1pYy10YWhyLTk1LmNsZXJrLmFjY291bnRzLmRldiQ
  - Frontend API: dynamic-tahr-95.clerk.accounts.dev
  
- **2025-11-02**: Added Affiliate & Order Tracking System
  - Created affiliate.js for managing affiliate codes, referral links, and commission tracking
  - Created order-tracking.js for order status tracking system
  - Built affiliate.html dashboard page with affiliate tools
  - Built order-tracking.html page for customers to track orders
  - Updated navigation across all pages to include new features
  - Integrated affiliate tracking on index.html to capture referral parameters
  - All data stored in localStorage (frontend-only, no backend required)
  
- **2024-10-15**: Initial project setup in Replit environment
  - Created Node.js HTTP server for static file serving
  - Configured workflow to run on port 5000
  - Added cache control headers to prevent caching issues
  - Set up deployment configuration

## Development
The website uses CDN-loaded libraries, so no build process is required. The server simply serves static files with proper MIME types and cache control headers.
