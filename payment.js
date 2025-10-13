document.addEventListener('DOMContentLoaded', function() {
    // Get cart data from localStorage
    const cartItems = JSON.parse(localStorage.getItem('zhalecthCart')) || [];

    // DOM Elements
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const taxElement = document.getElementById('tax');
    const totalAmountElement = document.getElementById('total-amount');
    const bankAmountElement = document.getElementById('bank-amount');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetailForms = document.querySelectorAll('.payment-details-form');
    const paymentForm = document.getElementById('payment-form');
    const successModal = document.getElementById('success-modal');
    const payButton = document.getElementById('pay-button');

    // Initialize order summary
    function initializeOrderSummary() {
        // Clear existing items
        orderItemsContainer.innerHTML = '';
        
        // Check if cart is empty
        if (cartItems.length === 0) {
            orderItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang belanja Anda kosong</p>
                    <a href="azhalecth.html" class="btn" style="margin-top: 20px; width: auto;">Kembali Berbelanja</a>
                </div>
            `;
            
            // Disable payment form if cart is empty
            paymentForm.querySelectorAll('input, textarea, button, select').forEach(element => {
                element.disabled = true;
            });
            
            payButton.innerHTML = '<i class="fas fa-lock"></i> Keranjang Kosong';
            payButton.disabled = true;
            
            return;
        }
        
        let subtotal = 0;
        
        // Add items to order summary
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-item-img">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">Rp ${item.price.toLocaleString()}</div>
                    <div class="order-item-quantity">Jumlah: ${item.quantity}</div>
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });
        
        // Calculate totals
        const shippingCost = 15000;
        const tax = Math.round(subtotal * 0.1); // 10% tax
        const total = subtotal + shippingCost + tax;
        
        // Update UI
        subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
        shippingCostElement.textContent = `Rp ${shippingCost.toLocaleString()}`;
        taxElement.textContent = `Rp ${tax.toLocaleString()}`;
        totalAmountElement.textContent = `Rp ${total.toLocaleString()}`;
        bankAmountElement.textContent = `Rp ${total.toLocaleString()}`;
    }

    // Payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            paymentOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('.payment-radio');
            radio.checked = true;
            
            // Show corresponding payment details
            const method = this.getAttribute('data-method');
            paymentDetailForms.forEach(form => {
                form.style.display = 'none';
            });
            
            document.getElementById(`${method}-details`).style.display = 'block';
        });
    });

    // Form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if cart is empty
        if (cartItems.length === 0) {
            alert('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }
        
        // Show loading state
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        payButton.disabled = true;
        
        // Simulate payment processing
        setTimeout(function() {
            // Clear cart after successful payment
            localStorage.removeItem('zhalecthCart');
            
            // Show success modal
            successModal.classList.add('active');
            
            // Reset button
            payButton.innerHTML = '<i class="fas fa-lock"></i> Bayar Sekarang';
            payButton.disabled = false;
        }, 2000);
    });

    // Initialize the page
    initializeOrderSummary();
});