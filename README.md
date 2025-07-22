
# Cube Assignment - Advanced Shopify Theme

A sophisticated Shopify theme featuring an advanced product page with subscription functionality, dynamic pricing, and interactive flavor selection.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Shopify CLI
- Access to a Shopify development store

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cube-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Connect to your Shopify store**
   ```bash
   shopify theme dev --store=your-dev-store.myshopify.com
   ```
   
   Follow the prompts to authenticate with your Shopify store.

4. **Start development**
   The theme will automatically open in your browser with live reload enabled.

## 🎯 Features

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

### 🛒 Add-to-Cart Logic
- Defaults to Single Drink + Chocolate on page load
- AJAX cart functionality
- Handles both single and double mode selections
- Proper variant management
- Cart reflects selected mode, flavors, and discounted price

## 🛠️ Technical Implementation

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

## 📝 Development Commands

```bash
# Start development server
npm run dev

# Package theme for upload
npm run build

# Deploy to production
npm run deploy

# Pull latest theme from store
npm run pull
```

## 🚀 Deployment

### Using Shopify CLI
```bash
shopify theme push --store=your-store.myshopify.com
```

### Using Replit Deployments
This project is configured to work with Replit's deployment system for development and testing.

## 📱 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Accessible keyboard navigation
- Screen reader compatible

## 🎨 Customization

### Pricing Configuration
Update pricing calculations in `cube-theme/assets/product-page.js`:
```javascript
this.subscriptionMultiplier = 0.75; // 25% off subscription
this.saleDiscount = 0.20; // Additional 20% sale discount
```

### Metafields Setup
Add custom metafields for "What's Included" content:
- `custom.single_mode_benefits` (rich text)
- `custom.double_mode_benefits` (rich text)
- `custom.single_delivery_frequency` (text)
- `custom.double_delivery_frequency` (text)

## 🐛 Known Issues & Solutions

1. **Theme not connecting to store**: Ensure you have proper permissions and the correct store URL
2. **JavaScript errors**: Check that all product variants are properly configured
3. **Pricing not updating**: Verify product metafields are set correctly

## 📞 Support

For issues and questions:
- Check the [Shopify CLI documentation](https://shopify.dev/themes/tools/cli)
- Review the theme files in `cube-theme/` directory
- Ensure all product variants and metafields are properly configured

## 📄 License

MIT License - see LICENSE file for details
