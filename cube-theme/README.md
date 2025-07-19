# Cube Theme - Advanced Shopify Product Page

A sophisticated Shopify theme featuring an advanced product page with subscription functionality, dynamic pricing, and interactive flavor selection.

## Features

### 🖼️ Product Media Gallery
- Interactive thumbnail carousel
- Main image updates on thumbnail click
- Images change based on selected variant (color/flavor)
- Smooth transitions and hover effects

### 📦 Purchase Options
- **Single Drink Subscription**: Perfect for individual needs
- **Double Drink Subscription**: Great for couples or extra servings
- Radio button selection with visual feedback
- Mode switching updates all related components

### 🎨 Flavor Selection
- Image swatches for Chocolate, Vanilla, Orange flavors
- Single mode: one flavor selector
- Double mode: two independent flavor selectors
- Visual feedback for selected flavors
- Blocks "Add to Cart" until all required flavors are chosen

### 💰 Dynamic Pricing & Discounts
- Pulls base price and compare-at-price from Shopify backend
- Subscription price = base price × 0.75 (25% off)
- Additional 20% sale discount on subscription price
- Real-time price updates
- Savings percentage display

### 📋 "What's Included" Box
- Content driven by product metafields
- Different content for single vs double modes
- Delivery frequency and benefits display
- Customizable via Shopify admin

### 🛒 Add-to-Cart Logic
- Defaults to Single Drink + Chocolate on page load
- AJAX cart functionality
- Handles both single and double mode selections
- Proper variant management
- Cart reflects selected mode, flavors, and discounted price

## Technical Implementation

### Built With
- **Shopify CLI** for theme development
- **Liquid** templating language
- **Vanilla JavaScript** for interactivity
- **SCSS** for styling
- **Shopify AJAX API** for cart functionality

### Key Files
- `templates/product.liquid` - Main product template
- `assets/product-page.scss` - Product page styles
- `assets/product-page.js` - Interactive functionality
- `layout/theme.liquid` - Theme layout with asset loading

### Data Sources
- Product variants for pricing and options
- Product metafields for "What's Included" content
- Product images for gallery and swatches
- No hard-coded data - everything pulls from Shopify

## Setup Instructions

### Prerequisites
- Shopify CLI installed
- Access to a Shopify development store
- Node.js and npm

### Installation
1. Clone or download the theme files
2. Navigate to the theme directory
3. Connect to your Shopify store:
   ```bash
   shopify theme dev
   ```
4. The theme will be available at the provided preview URL

### Product Setup
To fully utilize all features, set up your products with:

1. **Product Variants**: Create variants for different flavors (Chocolate, Vanilla, Orange)
2. **Product Images**: Add images for each variant
3. **Metafields**: Add custom metafields for "What's Included" content:
   - `custom.single_mode_benefits` (rich text)
   - `custom.double_mode_benefits` (rich text)
   - `custom.single_delivery_frequency` (text)
   - `custom.double_delivery_frequency` (text)

### Customization
- Modify pricing calculations in `product-page.js`
- Update styles in `product-page.scss`
- Customize "What's Included" content via metafields
- Adjust subscription discounts and sale percentages

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Accessible keyboard navigation
- Screen reader compatible

## Performance
- Optimized images with responsive loading
- Minimal JavaScript footprint
- CSS compiled from SCSS
- Efficient DOM manipulation

## Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast color schemes
- Focus management

## Mobile Responsive
- Adaptive layout for all screen sizes
- Touch-friendly interface
- Optimized for mobile shopping
- Swipe gestures for image gallery

This theme provides a complete, production-ready solution for advanced product pages with subscription functionality, perfect for beverage or supplement brands looking to offer flexible purchasing options with dynamic pricing.