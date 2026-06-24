// ===== PRODUCTS DATA =====
const products = [
  { id: 1, name: "Wireless Headphones", price: 29.99,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 2, name: "Smart Watch", price: 49.99,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: 3, name: "Laptop Bag", price: 34.99,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
  { id: 4, name: "Wireless Mouse", price: 14.99,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
];

// ===== SLIDER DATA =====
const slides = [
  { title: "Big Sale Today!",   sub: "Up to 60% Off Electronics", bg: "#1a1a2e" },
  { title: "Fashion Deals",     sub: "New Arrivals Every Day",     bg: "#16213e" },
  { title: "Free Delivery",     sub: "On Orders Above $30",        bg: "#0f3460" },
];

let currentSlide = 0;

// ===== SLIDER FUNCTIONS =====
function showSlide(index) {
  const slider = document.querySelector('.slider');
  const content = document.getElementById('slide-content');
  if (!slider || !content) return;

  slider.style.background = slides[index].bg;
  content.innerHTML = `
    <h2>${slides[index].title}</h2>
    <p>${slides[index].sub}</p>
    <button class="shop-btn">Shop Now</button>
  `;

  // Update dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// ===== BUILD DOTS =====
function buildDots() {
  const dotsDiv = document.getElementById('dots');
  if (!dotsDiv) return;
  dotsDiv.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.onclick = () => { currentSlide = i; showSlide(i); };
    dotsDiv.appendChild(dot);
  });
}

// Auto slide every 3 seconds
setInterval(nextSlide, 3000);

// ===== CART (localStorage) =====
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  let cart = getCart();
  const exists = cart.find(item => item.id === id);

  if (exists) {
    cart = cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  alert(`✅ ${product.name} added to cart!`);
}

function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const container = document.getElementById('products');
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <p class="price">$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

// ===== RENDER CART =====
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalDiv  = document.getElementById('cart-total');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty 😕</h3>
        <a href="index.html">Continue Shopping</a>
      </div>
    `;
    if (totalDiv) totalDiv.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>$${item.price} × ${item.qty}</p>
      </div>
      <div class="item-right">
        <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (totalDiv) {
    totalDiv.innerHTML = `
      <div class="cart-total">
        <h3>Total: $${total.toFixed(2)}</h3>
        <button class="checkout-btn" onclick="checkout()">Checkout</button>
      </div>
    `;
  }
}

// ===== CHECKOUT =====
function checkout() {
  alert('🎉 Order Placed! Thank you for shopping!');
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}

// ===== CONTACT FORM =====
function sendMessage(e) {
  e.preventDefault();
  document.getElementById('success-msg').style.display = 'block';
  e.target.reset();
}

// ===== INIT =====
buildDots();
showSlide(0);
renderProducts();
renderCart();
updateCartCount();