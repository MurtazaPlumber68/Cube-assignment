/**
 * Product Page JavaScript
 * Handles subscription modes, flavor selection, pricing, and cart functionality
 */

class ProductPage {
  constructor() {
    this.productData = JSON.parse(document.getElementById('product-data').textContent);
    this.currentMode = 'single';
    this.selectedFlavors = {
      single: null,
      first: null,
      second: null
    };
    this.basePrice = 0;
    this.subscriptionMultiplier = 0.75;
    this.saleDiscount = 0.20;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setDefaultSelections();
    this.updatePricing();
    this.updateAddToCartState();
  }

  setupEventListeners() {
    // Purchase mode selection
    document.querySelectorAll('input[name="subscription-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.handleModeChange(e.target.value);
      });
    });

    // Flavor selection
    document.querySelectorAll('.flavor-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        this.handleFlavorSelection(e.currentTarget);
      });
    });

    // Thumbnail carousel
    document.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        this.handleThumbnailClick(e.currentTarget);
      });
    });

    // Add to cart form
    document.getElementById('add-to-cart-form').addEventListener('submit', (e) => {
      this.handleAddToCart(e);
    });
  }

  setDefaultSelections() {
    // Set default to single mode with first variant (Chocolate)
    const firstVariant = this.productData.variants[0];
    if (firstVariant) {
      this.selectedFlavors.single = firstVariant.id;
      this.basePrice = firstVariant.price;
      
      // Select first flavor swatch in single mode
      const firstSwatch = document.querySelector('.single-mode .flavor-swatch');
      if (firstSwatch) {
        firstSwatch.classList.add('selected');
        
        // Update main image if variant has featured image
        if (firstVariant.featured_image) {
          this.updateMainImage(firstVariant.featured_image);
        }
      }
    }
  }

  handleModeChange(mode) {
    this.currentMode = mode;
    
    // Update UI
    this.updateModeUI();
    this.resetFlavorSelections();
    this.updatePricing();
    this.updateAddToCartState();
    this.updateWhatsIncluded();
  }

  updateModeUI() {
    // Update radio option styling
    document.querySelectorAll('.radio-option').forEach(option => {
      option.classList.remove('active');
    });
    document.querySelector(`[data-mode="${this.currentMode}"]`).classList.add('active');

    // Show/hide flavor groups
    document.querySelectorAll('.flavor-group').forEach(group => {
      group.classList.remove('active');
    });
    document.querySelector(`.flavor-group.${this.currentMode}-mode`).classList.add('active');
  }

  resetFlavorSelections() {
    // Clear all selections
    document.querySelectorAll('.flavor-swatch').forEach(swatch => {
      swatch.classList.remove('selected');
    });

    // Reset selected flavors
    this.selectedFlavors = {
      single: null,
      first: null,
      second: null
    };

    // Set default for single mode
    if (this.currentMode === 'single') {
      const firstSwatch = document.querySelector('.single-mode .flavor-swatch');
      if (firstSwatch) {
        firstSwatch.classList.add('selected');
        this.selectedFlavors.single = parseInt(firstSwatch.dataset.variantId);
        
        // Update main image
        if (firstSwatch.dataset.image) {
          this.updateMainImage(firstSwatch.dataset.image);
        }
      }
    }
  }

  handleFlavorSelection(swatch) {
    const variantId = parseInt(swatch.dataset.variantId);
    const selector = swatch.closest('.flavor-swatches').dataset.selector;
    
    if (this.currentMode === 'single') {
      // Single mode: only one selection
      document.querySelectorAll('.single-mode .flavor-swatch').forEach(s => {
        s.classList.remove('selected');
      });
      swatch.classList.add('selected');
      this.selectedFlavors.single = variantId;
    } else {
      // Double mode: handle first/second selection
      const swatchGroup = swatch.closest('.flavor-swatches');
      swatchGroup.querySelectorAll('.flavor-swatch').forEach(s => {
        s.classList.remove('selected');
      });
      swatch.classList.add('selected');
      
      if (selector === 'first') {
        this.selectedFlavors.first = variantId;
      } else {
        this.selectedFlavors.second = variantId;
      }
    }

    // Update main image
    if (swatch.dataset.image) {
      this.updateMainImage(swatch.dataset.image);
    }

    // Update pricing and cart state
    this.updatePricing();
    this.updateAddToCartState();
  }

  handleThumbnailClick(thumbnail) {
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');

    // Update main image
    const imageSrc = thumbnail.dataset.imageSrc;
    this.updateMainImage(imageSrc);
  }

  updateMainImage(imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = imageSrc;
    mainImage.classList.add('fade-in');
    
    setTimeout(() => {
      mainImage.classList.remove('fade-in');
    }, 300);
  }

  updatePricing() {
    let totalPrice = 0;
    let originalPrice = 0;

    if (this.currentMode === 'single') {
      if (this.selectedFlavors.single) {
        const variant = this.productData.variants.find(v => v.id === this.selectedFlavors.single);
        if (variant) {
          originalPrice = variant.compare_at_price || variant.price;
          totalPrice = variant.price;
        }
      }
    } else {
      // Double mode: sum of both flavors
      if (this.selectedFlavors.first) {
        const variant1 = this.productData.variants.find(v => v.id === this.selectedFlavors.first);
        if (variant1) {
          originalPrice += variant1.compare_at_price || variant1.price;
          totalPrice += variant1.price;
        }
      }
      if (this.selectedFlavors.second) {
        const variant2 = this.productData.variants.find(v => v.id === this.selectedFlavors.second);
        if (variant2) {
          originalPrice += variant2.compare_at_price || variant2.price;
          totalPrice += variant2.price;
        }
      }
    }

    // Calculate subscription price (25% off)
    const subscriptionPrice = totalPrice * this.subscriptionMultiplier;
    
    // Calculate final price with additional sale discount (20% off subscription price)
    const finalPrice = subscriptionPrice * (1 - this.saleDiscount);
    
    // Calculate total savings
    const totalSavings = originalPrice - finalPrice;
    const savingsPercentage = Math.round((totalSavings / originalPrice) * 100);

    // Update UI
    this.updatePriceDisplay(originalPrice, subscriptionPrice, finalPrice, savingsPercentage);
  }

  updatePriceDisplay(originalPrice, subscriptionPrice, finalPrice, savingsPercentage) {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price / 100);
    };

    document.getElementById('original-price').textContent = formatPrice(originalPrice);
    document.getElementById('subscription-price').textContent = formatPrice(subscriptionPrice);
    document.getElementById('final-price').textContent = formatPrice(finalPrice);
    document.getElementById('btn-price').textContent = formatPrice(finalPrice);
    
    const savingsBadge = document.getElementById('savings-badge');
    if (savingsPercentage > 0) {
      savingsBadge.textContent = `Save ${savingsPercentage}%`;
      savingsBadge.style.display = 'inline-block';
    } else {
      savingsBadge.style.display = 'none';
    }
  }

  updateWhatsIncluded() {
    document.querySelectorAll('.whats-included .included-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const activeContent = document.querySelector(`.whats-included .included-content.${this.currentMode}-mode`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  updateAddToCartState() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const variantIdInput = document.getElementById('variant-id');
    const quantityInput = document.getElementById('quantity-input');
    
    let canAddToCart = false;
    let variantId = null;
    let quantity = 1;

    if (this.currentMode === 'single') {
      canAddToCart = this.selectedFlavors.single !== null;
      variantId = this.selectedFlavors.single;
    } else {
      canAddToCart = this.selectedFlavors.first !== null && this.selectedFlavors.second !== null;
      // For double mode, we'll add the first variant and handle the second in the cart logic
      variantId = this.selectedFlavors.first;
      quantity = 2; // Or handle as separate line items
    }

    // Update button state
    addToCartBtn.disabled = !canAddToCart;
    
    if (canAddToCart) {
      addToCartBtn.querySelector('.btn-text').textContent = 'Add to Cart';
      variantIdInput.value = variantId;
      quantityInput.value = quantity;
    } else {
      addToCartBtn.querySelector('.btn-text').textContent = 'Select All Flavors';
    }
  }

  handleAddToCart(e) {
    e.preventDefault();
    
    if (!this.canAddToCart()) {
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    
    // Add custom properties for subscription mode
    formData.append('properties[Subscription Mode]', this.currentMode);
    
    if (this.currentMode === 'double' && this.selectedFlavors.second) {
      formData.append('properties[Second Flavor]', this.getVariantTitle(this.selectedFlavors.second));
    }

    // Show loading state
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const originalText = addToCartBtn.querySelector('.btn-text').textContent;
    addToCartBtn.querySelector('.btn-text').textContent = 'Adding...';
    addToCartBtn.disabled = true;

    // Submit the form via fetch
    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Success - update cart and show success message
      this.updateCartCount();
      this.showSuccessMessage();
      
      // Reset button state
      addToCartBtn.querySelector('.btn-text').textContent = originalText;
      addToCartBtn.disabled = false;
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      
      // Reset button state
      addToCartBtn.querySelector('.btn-text').textContent = originalText;
      addToCartBtn.disabled = false;
      
      // Show error message
      this.showErrorMessage('Failed to add item to cart. Please try again.');
    });
  }

  canAddToCart() {
    if (this.currentMode === 'single') {
      return this.selectedFlavors.single !== null;
    } else {
      return this.selectedFlavors.first !== null && this.selectedFlavors.second !== null;
    }
  }

  getVariantTitle(variantId) {
    const variant = this.productData.variants.find(v => v.id === variantId);
    return variant ? variant.title : '';
  }

  updateCartCount() {
    // Update cart count in header if present
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
          cartCount.textContent = cart.item_count;
        }
      });
  }

  showSuccessMessage() {
    // Show success notification
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Added to cart successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  showErrorMessage(text) {
    // Show error notification
    const message = document.createElement('div');
    message.className = 'error-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  setDefaultSelections() {
    // Set default mode to single
    const singleModeRadio = document.querySelector('input[name="subscription-mode"][value="single"]');
    if (singleModeRadio) {
      singleModeRadio.checked = true;
    }
    
    // Set initial pricing
    if (this.productData.variants && this.productData.variants.length > 0) {
      this.basePrice = this.productData.variants[0].price;
    }
  }

  handleModeChange(mode) {
    this.currentMode = mode;
    this.updateUI();
    this.updatePricing();
    this.updateAddToCartState();
  }

  handleFlavorSelection(swatch) {
    const flavorType = swatch.dataset.flavorType;
    const variantId = parseInt(swatch.dataset.variantId);
    
    // Remove active class from siblings
    swatch.parentElement.querySelectorAll('.flavor-swatch').forEach(s => {
      s.classList.remove('active');
    });
    
    // Add active class to clicked swatch
    swatch.classList.add('active');
    
    // Update selected flavors
    if (flavorType === 'single') {
      this.selectedFlavors.single = variantId;
    } else if (flavorType === 'first') {
      this.selectedFlavors.first = variantId;
    } else if (flavorType === 'second') {
      this.selectedFlavors.second = variantId;
    }
    
    this.updateAddToCartState();
  }

  handleThumbnailClick(thumbnail) {
    const imageUrl = thumbnail.dataset.imageUrl;
    const mainImage = document.querySelector('.main-image img');
    
    if (mainImage && imageUrl) {
      mainImage.src = imageUrl;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
  }

  updateUI() {
    // Update flavor selectors visibility
    const singleFlavorSelector = document.querySelector('.single-flavor-selector');
    const doubleFlavorSelectors = document.querySelector('.double-flavor-selectors');
    
    if (this.currentMode === 'single') {
      if (singleFlavorSelector) singleFlavorSelector.style.display = 'block';
      if (doubleFlavorSelectors) doubleFlavorSelectors.style.display = 'none';
    } else {
      if (singleFlavorSelector) singleFlavorSelector.style.display = 'none';
      if (doubleFlavorSelectors) doubleFlavorSelectors.style.display = 'block';
    }
    
    // Update "What's Included" content
    const whatsIncludedContent = document.querySelector('.whats-included-content');
    if (whatsIncludedContent) {
      const content = this.currentMode === 'single' 
        ? this.productData.single_mode_benefits 
        : this.productData.double_mode_benefits;
      
      if (content) {
        whatsIncludedContent.innerHTML = content;
      }
    }
  }

  updatePricing() {
    const subscriptionPrice = this.basePrice * this.subscriptionMultiplier;
    const finalPrice = subscriptionPrice * (1 - this.saleDiscount);
    const modeMultiplier = this.currentMode === 'double' ? 2 : 1;
    
    const finalPriceTotal = finalPrice * modeMultiplier;
    const originalPriceTotal = this.basePrice * modeMultiplier;
    
    // Update price displays
    const priceElement = document.querySelector('.price');
    const comparePriceElement = document.querySelector('.compare-price');
    const savingsElement = document.querySelector('.savings');
    
    if (priceElement) {
      priceElement.textContent = `$${(finalPriceTotal / 100).toFixed(2)}`;
    }
    
    if (comparePriceElement) {
      comparePriceElement.textContent = `$${(originalPriceTotal / 100).toFixed(2)}`;
    }
    
    if (savingsElement) {
      const savingsPercent = Math.round((1 - finalPriceTotal / originalPriceTotal) * 100);
      savingsElement.textContent = `Save ${savingsPercent}%`;
    }
  }

  updateAddToCartState() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const canAdd = this.canAddToCart();
    
    if (addToCartBtn) {
      addToCartBtn.disabled = !canAdd;
      addToCartBtn.querySelector('.btn-text').textContent = canAdd 
        ? 'Add to Cart' 
        : 'Select Flavors';
    }
  }
}

// Initialize the product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.product-page')) {
    new ProductPage();
  }
});

    // Submit via AJAX
    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Success - could show a success message or redirect
      console.log('Added to cart:', data);
      
      // If double mode, add second variant
      if (this.currentMode === 'double' && this.selectedFlavors.second && this.selectedFlavors.second !== this.selectedFlavors.first) {
        return this.addSecondVariant();
      }
    })
    .then(() => {
      // Update cart count or show success message
      this.showSuccessMessage();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      this.showErrorMessage();
    })
    .finally(() => {
      // Reset button state
      addToCartBtn.querySelector('.btn-text').textContent = originalText;
      addToCartBtn.disabled = false;
    });
  }

  addSecondVariant() {
    const formData = new FormData();
    formData.append('id', this.selectedFlavors.second);
    formData.append('quantity', '1');
    formData.append('properties[Subscription Mode]', this.currentMode);
    formData.append('properties[Position]', 'Second Flavor');

    return fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });
  }

  canAddToCart() {
    if (this.currentMode === 'single') {
      return this.selectedFlavors.single !== null;
    } else {
      return this.selectedFlavors.first !== null && this.selectedFlavors.second !== null;
    }
  }

  getVariantTitle(variantId) {
    const variant = this.productData.variants.find(v => v.id === variantId);
    return variant ? variant.title : '';
  }

  showSuccessMessage() {
    // Could implement a toast notification or modal
    alert('Successfully added to cart!');
  }

  showErrorMessage() {
    // Could implement a toast notification or modal
    alert('Error adding to cart. Please try again.');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductPage();
});