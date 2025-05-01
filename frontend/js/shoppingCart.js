// Shopping Cart State
let cartItems = [];

// DOM Elements
const cartIcon = document.querySelector('.header-right img[alt="shopping_bag-icon"]');
const cartSidebar = document.createElement('div');
cartSidebar.className = 'cart-sidebar';
document.body.appendChild(cartSidebar);

// Initialize cart sidebar HTML
cartSidebar.innerHTML = `
    <div class="cart-header">
        <h2>Panier</h2>
        <button class="close-cart">&times;</button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-footer">
        <div class="cart-total">
            <span>Total:</span>
            <span class="total-amount">0.00€</span>
        </div>
        <button class="checkout-btn" onclick="window.location.href='../templates/checkout.html'">Passer la commande</button>
    </div>
`;

// Event Listeners
cartIcon.addEventListener('click', toggleCart);
cartSidebar.querySelector('.close-cart').addEventListener('click', toggleCart);

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    updateCartDisplay();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cartItems.find(item =>
        item.id === product.id &&
        item.color === product.color
    );

    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cartItems.push(product);
    }

    saveCart();
    updateCartDisplay();
    toggleCart(); // Open the cart when an item is added
}

// Remove item from cart
function removeFromCart(productId, color) {
    cartItems = cartItems.filter(item => !(item.id === productId && item.color === color));
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, newQuantity, color) {
    const item = cartItems.find(item => item.id === productId && item.color === color);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId, color);
        }
        saveCart();
        updateCartDisplay();
    }
}

// Calculate total price
function calculateTotal() {
    return cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = cartSidebar.querySelector('.cart-items');
    const totalAmount = cartSidebar.querySelector('.total-amount');
    const checkoutBtn = cartSidebar.querySelector('.checkout-btn');

    // Clear the cart items container
    cartItemsContainer.innerHTML = '';

    // Re-render the cart items
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.dataset.id = item.id;
        cartItemElement.dataset.color = item.color;

        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${item.price}€</p>
                <p class="item-color">Couleur: ${item.color}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <button class="remove-item">&times;</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);

        // Add event listeners for quantity controls
        const minusBtn = cartItemElement.querySelector('.minus');
        const plusBtn = cartItemElement.querySelector('.plus');
        const removeBtn = cartItemElement.querySelector('.remove-item');

        minusBtn.addEventListener('click', () => {
            updateQuantity(item.id, item.quantity - 1, item.color);
        });

        plusBtn.addEventListener('click', () => {
            updateQuantity(item.id, item.quantity + 1, item.color);
        });

        removeBtn.addEventListener('click', () => {
            removeFromCart(item.id, item.color);
        });
    });

    // Update the total amount
    const total = calculateTotal();
    totalAmount.textContent = `${total.toFixed(2)}€`;

    // Enable/disable checkout button based on cart items
    checkoutBtn.disabled = cartItems.length === 0;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', loadCart);

// Make functions globally available
window.addToCart = addToCart;
window.calculateTotal = calculateTotal;