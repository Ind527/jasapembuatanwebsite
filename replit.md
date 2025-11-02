# SitusKita - Website Jasa Pembuatan Website

## Overview
Static HTML website for SitusKita, a professional web development services company. The website showcases services, portfolio, pricing, and contact information. **Now includes Affiliate System and Order Tracking features** - both frontend-only solutions using localStorage.

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
├── affiliate.html      # Affiliate dashboard page
├── order-tracking.html # Order tracking page
├── main.js            # Main JavaScript file
├── affiliate.js       # Affiliate system logic
├── order-tracking.js  # Order tracking system logic
├── server.js          # Node.js static file server
└── *.jpeg            # Portfolio images
```

## Setup & Configuration
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (to allow Replit proxy)
- **Cache Control**: Disabled to ensure latest changes are visible

## Recent Changes
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
