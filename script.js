// === FIX: RESET ALL MODALS ON PAGE LOAD ===
window.addEventListener('load', function() {
    console.log('Page fully loaded - resetting all modals');
    
    // Close user panel
    const userPanel = document.getElementById('user-panel');
    if (userPanel) {
        userPanel.classList.remove('active');
        console.log('User panel closed');
    }
    
    // Close cart sidebar
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        console.log('Cart sidebar closed');
    }
    
    // Close overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('active');
        console.log('Overlay closed');
    }
    
    // Reset body overflow
    document.body.style.overflow = '';
    
    // Close search bar
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.classList.remove('active');
        console.log('Search bar closed');
    }
    
    console.log('All modals reset successfully');
});

// Animasi Scroll
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script.js loaded successfully'); // Debug
    
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const elementsToAnimate = document.querySelectorAll(
        '.hero-text, .hero-image, .section-title, .feature-card, .product-card, .testimonial, .cta-content'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Search Bar Functionality
document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.getElementById("search-icon");
    const searchBar = document.getElementById("search-bar");
    const searchInput = searchBar ? searchBar.querySelector("input") : null;

    // Toggle search bar
    if (searchIcon) {
        searchIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            searchBar.classList.toggle("active");

            // Fokus otomatis saat terbuka
            if (searchBar.classList.contains("active") && searchInput) {
                searchInput.focus();
            }
        });
    }

    // Tutup jika klik di luar search bar DAN bukan icon search
    document.addEventListener("click", function (e) {
        if (searchBar) {
            const clickInsideBar = searchBar.contains(e.target);
            const clickOnIcon = searchIcon.contains(e.target);

            if (!clickInsideBar && !clickOnIcon) {
                searchBar.classList.remove("active");
            }
        }
    });

    // Opsional: tekan ESC untuk menutup
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && searchBar) {
            searchBar.classList.remove("active");
        }
    });
});

// Cart Functionality
let cart = [];

// Initialize cart functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    console.log('Cart elements:', { cartIcon, cartSidebar, closeCart, overlay, addToCartButtons, cartItemsContainer, cartTotal }); // Debug

    // Open cart sidebar
    if (cartIcon && cartSidebar && overlay) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Cart opened'); // Debug
        });
    }

    // Close cart sidebar
    if (closeCart && cartSidebar && overlay) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Cart closed via close button'); // Debug
        });
    }

    // Close cart when clicking overlay
    if (overlay && cartSidebar) {
        overlay.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            const userPanel = document.getElementById('user-panel');
            if (userPanel) userPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Cart closed via overlay'); // Debug
        });
    }

    // Update cart display
    function updateCart() {
        if (!cartItemsContainer || !cartTotal) return;
        
    // Clear container safely
    cartItemsContainer.textContent = '';
        let total = 0;

        const checkoutBtn = document.querySelector('.cart-actions a[href="payment.html"]'); // ambil tombol checkout

        if (cart.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-cart-message';
            const p = document.createElement('p');
            p.textContent = 'Keranjang belanja Anda kosong';
            emptyMsg.appendChild(p);
            cartItemsContainer.appendChild(emptyMsg);
            // Nonaktifkan tombol checkout
            if (checkoutBtn) {
                checkoutBtn.classList.add('disabled');
                checkoutBtn.style.pointerEvents = 'none';
                checkoutBtn.style.opacity = '0.5';
            }
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;

                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = item.image || '';
                img.alt = item.name || '';
                cartItem.appendChild(img);

                const details = document.createElement('div');
                details.className = 'cart-item-details';

                const h4 = document.createElement('h4');
                h4.textContent = item.name;

                const priceEl = document.createElement('p');
                priceEl.className = 'cart-item-price';
                priceEl.textContent = `Rp ${item.price.toLocaleString()}`;

                const qtyControls = document.createElement('div');
                qtyControls.className = 'quantity-controls';

                const decBtn = document.createElement('button');
                decBtn.className = 'decrease-quantity';
                decBtn.dataset.index = index;
                decBtn.textContent = '-';

                const qtySpan = document.createElement('span');
                qtySpan.className = 'item-quantity';
                qtySpan.textContent = item.quantity;

                const incBtn = document.createElement('button');
                incBtn.className = 'increase-quantity';
                incBtn.dataset.index = index;
                incBtn.textContent = '+';

                qtyControls.appendChild(decBtn);
                qtyControls.appendChild(qtySpan);
                qtyControls.appendChild(incBtn);

                details.appendChild(h4);
                details.appendChild(priceEl);
                details.appendChild(qtyControls);

                cartItem.appendChild(details);

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-item';
                removeBtn.dataset.index = index;
                const icon = document.createElement('i');
                icon.className = 'fas fa-trash';
                removeBtn.appendChild(icon);
                cartItem.appendChild(removeBtn);

                cartItemsContainer.appendChild(cartItem);
            });

            // Aktifkan tombol checkout
            if (checkoutBtn) {
                checkoutBtn.classList.remove('disabled');
                checkoutBtn.style.pointerEvents = 'auto';
                checkoutBtn.style.opacity = '1';
            }
        }

        cartTotal.textContent = `Rp ${total.toLocaleString()}`;
        localStorage.setItem('zhalecthCart', JSON.stringify(cart));

        attachCartEvents();
    }

    function attachCartEvents() {
        // Remove item buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                const index = e.currentTarget.dataset.index;
                cart.splice(index, 1);
                updateCart();
            });
        });

        // Increase quantity buttons
        const increaseButtons = document.querySelectorAll('.increase-quantity');
        increaseButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                const index = e.currentTarget.dataset.index;
                cart[index].quantity += 1;
                updateCart();
            });
        });

        // Decrease quantity buttons
        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        decreaseButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                const index = e.currentTarget.dataset.index;
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
    }

    // Add to cart functionality dengan pengecekan login
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                
                // Cek apakah user sudah login
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) {
                    // Jika belum login, tampilkan pesan dan buka panel user
                    showMessage('login untuk menambahkan produk ke keranjang', 'error');
                    
                    // Buka panel user untuk login
                    const userPanel = document.getElementById('user-panel');
                    return; // Hentikan eksekusi
                }
                
                // Lanjutkan proses add to cart jika sudah login
                const name = btn.dataset.name;
                const price = parseInt(btn.dataset.price);
                const image = btn.dataset.image;
                
                // Check if item already exists in cart
                const existingItemIndex = cart.findIndex(item => item.name === name);
                
                if (existingItemIndex !== -1) {
                    // Increase quantity if item exists
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push({ 
                        name, 
                        price, 
                        image, 
                        quantity: 1 
                    });
                }
                
                updateCart();
                if (cartSidebar && overlay) {
                    cartSidebar.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                console.log('Item added to cart:', name); // Debug
            });
        });
    }

    // Auto close cart when "Lanjutkan Belanja" button is clicked
    const continueShoppingBtn = document.querySelector('.cart-actions .btn[href="#products"]');
    
    console.log('Continue shopping button:', continueShoppingBtn); // Debug
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Continue shopping button clicked'); // Debug
            
            // Close cart sidebar
            const cartSidebar = document.getElementById('cart-sidebar');
            const overlay = document.getElementById('overlay');
            
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
                console.log('Cart sidebar closed'); // Debug
            }
            
            if (overlay) {
                overlay.classList.remove('active');
                console.log('Overlay closed'); // Debug
            }
            
            document.body.style.overflow = '';
            
            // Scroll to products section
            const productsSection = document.getElementById('products');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                console.log('Scrolling to products section'); // Debug
            }
        });
    }

    // Initialize cart
    updateCart();
});

// User Panel Functionality - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('user-icon');
    const userPanel = document.getElementById('user-panel');
    const closeUser = document.getElementById('close-user');
    const overlay = document.getElementById('overlay');

    // Pastikan panel tertutup saat halaman dimuat
    if (userPanel) userPanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Open user panel HANYA ketika ikon user diklik
    if (userIcon && userPanel && overlay) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('User icon clicked - opening panel');
            userPanel.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close user panel
    if (closeUser && userPanel && overlay) {
        closeUser.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close user panel clicked');
            userPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close user panel when clicking overlay
    if (overlay && userPanel) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                console.log('Overlay clicked - closing panels');
                userPanel.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            
            if (email && password) {
                // Simple validation
                if (email.value && password.value) {
                    // In a real app, you would send this to a server
                    isLoggedIn = true;
                    updateUserPanel();
                } else {
                    alert('Harap isi email dan password');
                }
            }
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            isLoggedIn = false;
            updateUserPanel();
            // Clear form fields
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            if (email) email.value = '';
            if (password) password.value = '';
        });
    }

    // Register link
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "register.html";
        });
    }

    // Update user panel based on login status
    function updateUserPanel() {
        if (loginForm && userMenu) {
            if (isLoggedIn) {
                loginForm.style.display = 'none';
                userMenu.style.display = 'block';
            } else {
                loginForm.style.display = 'block';
                userMenu.style.display = 'none';
            }
        }
    }

    // Initialize user panel
    updateUserPanel();
});

// Auto-update copyright year
document.addEventListener('DOMContentLoaded', function() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// User Authentication System
function initializeAuthSystem() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userInfo = document.getElementById('user-info');
    const userDetails = userInfo ? userInfo.querySelector('.user-details') : null;

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUserPanel(true, currentUser);
    }

    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                loginUser(email, password);
            } else {
                showMessage('Harap isi email dan password', 'error');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('zhalecthUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Jika login berhasil
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserPanel(true, user);
        updateBuyButtons(); // Update tombol beli
        showMessage(`Selamat datang, ${user.username}!`, 'success');
        
        // Bersihkan input form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } else {
        // Jika login gagal
        showMessage('Email atau password salah', 'error');
        
        // Pastikan tampilan tetap di halaman login
        updateUserPanel(false);
        updateBuyButtons(); // Update tombol beli
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    updateUserPanel(false);
    updateBuyButtons(); // Update tombol beli
    showMessage('Anda telah logout', 'info');
}

function updateUserPanel(isLoggedIn, userData = null) {
    const loginForm = document.getElementById('login-form');
    const userMenu = document.getElementById('user-menu');
    const userInfo = document.getElementById('user-info');
    const userDetails = userInfo ? userInfo.querySelector('.user-details') : null;

    if (isLoggedIn && userData) {
        // User logged in
        if (loginForm) loginForm.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userDetails) {
            // Safely set user details to avoid XSS
            userDetails.textContent = '';
            const h3 = document.createElement('h3');
            h3.textContent = userData.username || '';
            const p = document.createElement('p');
            p.textContent = userData.email || '';
            userDetails.appendChild(h3);
            userDetails.appendChild(p);
        }
        
        // Aktifkan tombol beli
        updateBuyButtons();
    } else {
        // User not logged in
        if (loginForm) loginForm.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        if (userDetails) {
            userDetails.textContent = '';
            const h3 = document.createElement('h3');
            h3.textContent = 'Guest User';
            const p = document.createElement('p');
            p.textContent = 'guest@example.com';
            userDetails.appendChild(h3);
            userDetails.appendChild(p);
        }
        
        // Nonaktifkan tombol beli
        updateBuyButtons();
    }
}

function showMessage(message, type = 'info') {
    // Create temporary message element
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            messageEl.style.backgroundColor = '#00C851';
            break;
        case 'error':
            messageEl.style.backgroundColor = '#ff4444';
            break;
        default:
            messageEl.style.backgroundColor = '#33b5e5';
    }
    
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Fungsi untuk update status tombol beli berdasarkan login
function updateBuyButtons() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const buyButtons = document.querySelectorAll('.add-to-cart');
    
    if (currentUser) {
        // User sudah login - aktifkan semua tombol
        buyButtons.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
        });
    } else {
        // User belum login - nonaktifkan semua tombol
        buyButtons.forEach(btn => {
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            btn.disabled = true;
        });
    }
}

// Update tombol beli saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateBuyButtons();
    
    // Update tombol beli saat status login berubah
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            updateBuyButtons();
        }
    });
});

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthSystem();
});

// ========== MOBILE-SPECIFIC IMPROVEMENTS ==========

// Mobile-specific improvements
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Optimize for mobile
        optimizeForMobile();
    }
    
    // Improve touch experience
    improveTouchExperience();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
});

function optimizeForMobile() {
    // Reduce particle effects on mobile for better performance
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: {
                    value: 30, // Reduced from 80
                    density: {
                        enable: true,
                        value_area: 400 // Reduced from 800
                    }
                }
            }
        });
    }
    
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
}

function improveTouchExperience() {
    // Prevent zoom on double tap for buttons
    const interactiveElements = document.querySelectorAll('.btn, .nav-icons i, .add-to-cart');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Improve scroll performance
    document.addEventListener('touchmove', function(e) {
        // Allow native scrolling
    }, { passive: true });
}

// Mobile navigation functionality
function initializeMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-mobile-nav';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeBtn.appendChild(closeIcon);

    const ul = document.createElement('ul');
    ul.className = 'mobile-nav-links';
    const links = [
        { href: '#home', text: 'Home' },
        { href: '#products', text: 'Product' },
        { href: '#features', text: 'Feature' },
        { href: '#testimonials', text: 'Testimonial' },
        { href: '#contact', text: 'Contact' }
    ];

    links.forEach(l => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = l.href;
        a.textContent = l.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    mobileNav.appendChild(closeBtn);
    mobileNav.appendChild(ul);
    
    document.body.appendChild(mobileNav);
    
    const closeMobileNav = mobileNav.querySelector('.close-mobile-nav');
    const overlay = document.getElementById('overlay');
    
    // Open mobile nav
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile nav
    if (closeMobileNav) {
        closeMobileNav.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile nav when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile nav when clicking links
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Debugging - Check why user panel opens
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking user panel state');
    
    const userPanel = document.getElementById('user-panel');
    const overlay = document.getElementById('overlay');
    
    if (userPanel && userPanel.classList.contains('active')) {
        console.warn('WARNING: User panel was active on page load! Closing it...');
        userPanel.classList.remove('active');
    }
    
    if (overlay && overlay.classList.contains('active')) {
        console.warn('WARNING: Overlay was active on page load! Closing it...');
        overlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
});