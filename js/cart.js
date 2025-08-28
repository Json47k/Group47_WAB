let cartItemCount = 0;

// Product name mapping for better display names - using actual product page names
const productNames = {
    "1": "Esprit Women Shirt",
    "2": "Women Blouse",
    "3": "Men Trouser",
    "4": "Classic Trench Women Coat",
    "5": "Vintage Inspired Classic Watch",
    "6": "Men Lightweight Jacket",
    "7": "Belt",
    "8": "Women Round Neck Shirt",
    "Product 1": "Esprit Women Shirt",
    "Product 2": "Women Blouse", 
    "Product 3": "Men Trouser",
    "Product 4": "Classic Trench Women Coat",
    "Product 5": "Vintage Inspired Classic Watch",
    "Product 6": "Men Lightweight Jacket",
    "Product 7": "Belt",
    "Product 8": "Women Round Neck Shirt"
};

function updateCartCounter() {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Calculate total items in cart
    cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
    
    // Update both cart icons
    $('.icon-header-noti.js-show-cart').attr('data-notify', cartItemCount);
    $('.icon-header-item.js-show-cart').attr('data-notify', cartItemCount);

    // Calculate total price
    let totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    $('.header-cart-total').text('Total: RM' + totalPrice.toFixed(2));
}

function addToCart(productId, productName, productPrice, productImg) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Use fancy product name if available
    const fancyName = productNames[productId] || productNames[productName] || productName;
    
    // Check if the product already exists in the cart
    let existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // If the product exists, update the quantity
        existingProduct.qty += 1;
    } else {
        // If the product doesn't exist, add it to the cart
        cart.push({
            id: productId,
            name: fancyName,
            price: parseFloat(productPrice),
            qty: 1,
            img: productImg
        });
    }

    // Clean up any items with 0 quantity
    cart = cart.filter(item => item.qty > 0);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart counter
    updateCartCounter();
    
    // Show success message
    swal(fancyName, "is added to cart !", "success");
    
    // Refresh cart display if on cart page
    if (typeof renderCartItems === 'function') {
        if (typeof cleanCartData === 'function') {
            cleanCartData();
        }
        renderCartItems();
        if (typeof updateTotal === 'function') {
            updateTotal();
        }
    }
}

// Function to add multiple quantities of a product
function addToCartWithQuantity(productId, productName, productPrice, productImg, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Use fancy product name if available
    const fancyName = productNames[productId] || productNames[productName] || productName;
    
    // Check if the product already exists in the cart
    let existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // If the product exists, update the quantity
        existingProduct.qty += quantity;
    } else {
        // If the product doesn't exist, add it to the cart
        cart.push({
            id: productId,
            name: fancyName,
            price: parseFloat(productPrice),
            qty: quantity,
            img: productImg
        });
    }

    // Clean up any items with 0 quantity
    cart = cart.filter(item => item.qty > 0);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart counter
    updateCartCounter();
    
    // Show success message
    swal(fancyName + " (x" + quantity + ")", "is added to cart !", "success");
    
    // Refresh cart display if on cart page
    if (typeof renderCartItems === 'function') {
        if (typeof cleanCartData === 'function') {
            cleanCartData();
        }
        renderCartItems();
        if (typeof updateTotal === 'function') {
            updateTotal();
        }
    }
}



function updateCartItemQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (index >= 0 && index < cart.length) {
        if (newQuantity <= 0) {
            // Set minimum quantity to 1 instead of removing
            cart[index].qty = 1;
        } else {
            cart[index].qty = parseInt(newQuantity);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
        
        // Refresh cart display if on cart page
        if (typeof renderCartItems === 'function') {
            renderCartItems();
            if (typeof updateTotal === 'function') {
                updateTotal();
            }
        }
    }
}

function initCart() {
    // Initialize cart in localStorage if it doesn't exist
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }

    // Remove any existing event listeners first to prevent duplicates
    $('.js-addcart-detail').off('click');

    // Add event listeners for all "Add to Cart" buttons with class js-addcart-detail
    $('.js-addcart-detail').each(function(){
        $(this).on('click', function(e){
            // Prevent default behavior just in case
            e.preventDefault();
            
            // Get product details from data attributes
            let productId = $(this).data('product-id');
            let productName = $(this).data('product-name');
            let productPrice = $(this).data('product-price');
            let productImg = $(this).data('product-image');
            
            // If data attributes are not available, try to get from DOM
            if (!productId) {
                productId = $(this).closest('.p-r-50').find('.js-name-detail').html() || 'unknown';
            }
            if (!productName) {
                productName = $(this).closest('.p-r-50').find('.js-name-detail').html() || 'Product';
            }
            if (!productPrice) {
                productPrice = $(this).closest('.p-r-50').find('.mtext-106').text().replace('RM', '').trim() || '0';
            }
            if (!productImg) {
                productImg = $(this).closest('.p-r-50').find('img').attr('src') || '';
            }

            // Get quantity from input field if available
            let quantity = 1;
            const quantityInput = $(this).closest('.p-r-50').find('.num-product');
            if (quantityInput.length > 0) {
                quantity = parseInt(quantityInput.val()) || 1;
            }

            // Add to cart with quantity
            addToCartWithQuantity(productId, productName, productPrice, productImg, quantity);
        });
    });

    // Initial update of cart counter
    updateCartCounter();
}
