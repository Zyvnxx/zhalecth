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
    // Clear existing items safely
    orderItemsContainer.textContent = '';
        
        // Check if cart is empty
        if (cartItems.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-cart-message';

            const icon = document.createElement('i');
            icon.className = 'fas fa-shopping-cart';
            emptyDiv.appendChild(icon);

            const p = document.createElement('p');
            p.textContent = 'Keranjang belanja Anda kosong';
            emptyDiv.appendChild(p);

            const a = document.createElement('a');
            a.href = 'azhalecth.html';
            a.className = 'btn';
            a.style.marginTop = '20px';
            a.style.width = 'auto';
            a.textContent = 'Kembali Berbelanja';
            emptyDiv.appendChild(a);

            orderItemsContainer.appendChild(emptyDiv);
            
            // Disable payment form if cart is empty
            paymentForm.querySelectorAll('input, textarea, button, select').forEach(element => {
                element.disabled = true;
            });
            
            payButton.textContent = '';
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock';
            payButton.appendChild(lockIcon);
            payButton.appendChild(document.createTextNode(' Keranjang Kosong'));
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

            const img = document.createElement('img');
            img.className = 'order-item-img';
            img.src = item.image || '';
            img.alt = item.name || '';
            orderItem.appendChild(img);

            const details = document.createElement('div');
            details.className = 'order-item-details';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'order-item-name';
            nameDiv.textContent = item.name;

            const priceDiv = document.createElement('div');
            priceDiv.className = 'order-item-price';
            priceDiv.textContent = `Rp ${item.price.toLocaleString()}`;

            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'order-item-quantity';
            qtyDiv.textContent = `Jumlah: ${item.quantity}`;

            details.appendChild(nameDiv);
            details.appendChild(priceDiv);
            details.appendChild(qtyDiv);

            orderItem.appendChild(details);
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
        
        // Get customer data from form
        const customerData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value
        };
        
        // Validate required fields
        if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address || !customerData.city) {
            alert('Harap lengkapi semua informasi pengiriman.');
            return;
        }
        
        // Show loading state
    payButton.textContent = '';
    const spinner = document.createElement('i');
    spinner.className = 'fas fa-spinner fa-spin';
    payButton.appendChild(spinner);
    payButton.appendChild(document.createTextNode(' Memproses...'));
        payButton.disabled = true;
        
        // Simulate payment processing
        setTimeout(function() {
            // Save order to orders history
            const orderData = saveOrderToHistory();
            
            // Generate receipt automatically
            generateReceiptForOrder(orderData, customerData);
            
            // Clear cart after successful payment
            localStorage.removeItem('zhalecthCart');
            
            // Show success modal with receipt info
            showSuccessModal(orderData);
            
            // Reset button
            payButton.textContent = '';
            const lockIcon2 = document.createElement('i');
            lockIcon2.className = 'fas fa-lock';
            payButton.appendChild(lockIcon2);
            payButton.appendChild(document.createTextNode(' Bayar Sekarang'));
            payButton.disabled = false;
        }, 2000);
    });

    // Save order to order history
    function saveOrderToHistory() {
        const orders = JSON.parse(localStorage.getItem('zhalecthOrders')) || [];
        
        const newOrder = {
            id: 'ZH' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            status: 'processing',
            items: [...cartItems]
        };
        
        orders.push(newOrder);
        localStorage.setItem('zhalecthOrders', JSON.stringify(orders));
        
        return newOrder;
    }

    // Generate receipt for order
    function generateReceiptForOrder(orderData, customerData) {
        // Generate receipt using receipt system
        const receipt = receiptSystem.generateReceipt(orderData, customerData);
        
        // Save receipt to localStorage
        receiptSystem.saveReceipt(receipt);
        
        return receipt;
    }

    // Show success modal with receipt information
    function showSuccessModal(orderData) {
        // Get the generated receipt
        const receipt = receiptSystem.getReceiptByOrderId(orderData.id);
        
        if (receipt) {
            // Update modal content with receipt info
            const modalContent = successModal.querySelector('.modal');
            // Clear previous content
            modalContent.textContent = '';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'modal-icon';
            const okIcon = document.createElement('i');
            okIcon.className = 'fas fa-check-circle';
            iconDiv.appendChild(okIcon);

            const title = document.createElement('h2');
            title.className = 'modal-title';
            title.textContent = 'Pembayaran Berhasil!';

            const receiptInfo = document.createElement('div');
            receiptInfo.className = 'receipt-info';
            receiptInfo.style.cssText = 'text-align: left; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;';

            const h4 = document.createElement('h4');
            h4.style.marginBottom = '15px';
            h4.style.color = '#333';
            h4.textContent = 'Informasi Pengiriman:';
            receiptInfo.appendChild(h4);

            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;';

            const labels = ['No. Resi:', 'Kurir:', 'Layanan:', 'Estimasi Tiba:'];
            const values = [
                receipt.receiptNumber,
                receipt.courier.name,
                receipt.courier.service,
                new Date(receipt.shipping.estimatedDelivery).toLocaleDateString('id-ID')
            ];

            for (let i = 0; i < labels.length; i++) {
                const lab = document.createElement('div');
                lab.textContent = '';
                const strong = document.createElement('strong');
                strong.textContent = labels[i];
                lab.appendChild(strong);
                const val = document.createElement('div');
                val.textContent = values[i] || '';
                grid.appendChild(lab);
                grid.appendChild(val);
            }

            receiptInfo.appendChild(grid);

            const modalText = document.createElement('p');
            modalText.className = 'modal-text';
            modalText.textContent = 'Terima kasih telah berbelanja di Zhalecth. Pesanan Anda sedang diproses dan akan dikirim segera.';

            const actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

            const aHome = document.createElement('a');
            aHome.href = 'azhalecth.html';
            aHome.className = 'btn';
            aHome.textContent = 'Kembali ke Beranda';

            const aReceipt = document.createElement('a');
            aReceipt.href = `receipt.html?receipt=${encodeURIComponent(receipt.receiptNumber)}`;
            aReceipt.className = 'btn';
            aReceipt.style.background = 'var(--light)';
            aReceipt.style.color = 'var(--primary)';
            aReceipt.textContent = '';
            const recIcon = document.createElement('i');
            recIcon.className = 'fas fa-receipt';
            aReceipt.appendChild(recIcon);
            aReceipt.appendChild(document.createTextNode(' Lihat Resi'));

            const aOrders = document.createElement('a');
            aOrders.href = 'orders.html';
            aOrders.className = 'btn';
            aOrders.style.background = '#28a745';
            aOrders.style.color = 'white';
            aOrders.textContent = '';
            const bagIcon = document.createElement('i');
            bagIcon.className = 'fas fa-shopping-bag';
            aOrders.appendChild(bagIcon);
            aOrders.appendChild(document.createTextNode(' Lihat Pesanan'));

            actionsDiv.appendChild(aHome);
            actionsDiv.appendChild(aReceipt);
            actionsDiv.appendChild(aOrders);

            modalContent.appendChild(iconDiv);
            modalContent.appendChild(title);
            modalContent.appendChild(receiptInfo);
            modalContent.appendChild(modalText);
            modalContent.appendChild(actionsDiv);
        }
        
        successModal.classList.add('active');
    }

    // Initialize the page
    initializeOrderSummary();
});

// QRIS Payment System
class QRISPayment {
    constructor() {
        this.qrisData = null;
    }

    // Generate QRIS data
    generateQRIS(amount, orderId) {
        const qrisData = {
            version: '01',
            type: '11',
            merchantId: 'ZHALECTH001',
            merchantName: 'ZHALECTH STORE',
            transactionAmount: amount,
            transactionCurrency: 'IDR',
            countryCode: 'ID',
            merchantCity: 'Serang',
            postalCode: '42111',
            orderId: orderId,
            timestamp: new Date().toISOString()
        };

        // Format data untuk QRIS standar Indonesia
        const qrisString = this.formatQRISString(qrisData);
        this.qrisData = qrisData;
        
        return qrisString;
    }

    // Format string untuk QRIS
    formatQRISString(data) {
        let qrisString = '';
        
        // Header QRIS
        qrisString += '000201';
        
        // Merchant Account Information
        qrisString += '010211';
        qrisString += '0016A000000000000';
        qrisString += '0109ZHALECTH01';
        
        // Merchant Category Code
        qrisString += '52045999';
        
        // Transaction Currency
        qrisString += '5303158';
        
        // Transaction Amount
        const amount = data.transactionAmount.toString().padStart(13, '0');
        qrisString += '54' + (amount.length.toString().padStart(2, '0')) + amount;
        
        // Country Code
        qrisString += '5802ID';
        
        // Merchant Name
        qrisString += '59' + (data.merchantName.length.toString().padStart(2, '0')) + data.merchantName;
        
        // Merchant City
        qrisString += '60' + (data.merchantCity.length.toString().padStart(2, '0')) + data.merchantCity;
        
        // Postal Code
        qrisString += '61' + (data.postalCode.length.toString().padStart(2, '0')) + data.postalCode;
        
        // Additional Data Field - Order ID
        qrisString += '62' + (data.orderId.length.toString().padStart(2, '0')) + data.orderId;
        
        // CRC
        qrisString += '6304';
        
        return qrisString;
    }

    // Generate QR Code visual
    generateQRCode(qrisString, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

    // Clear previous QR code safely
    container.textContent = '';

        // Create canvas for QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const size = options.size || 200;
        canvas.width = size;
        canvas.height = size;
        
        // Generate QR code pattern
        this.drawQRCode(ctx, qrisString, size);
        
        container.appendChild(canvas);
        
        // Add merchant info
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 12px;
            text-align: center;
        `;
        // Build merchant info safely
        const mnDiv = document.createElement('div');
        const mnStrong = document.createElement('strong');
        mnStrong.textContent = this.qrisData.merchantName || '';
        mnDiv.appendChild(mnStrong);

        const cityDiv = document.createElement('div');
        cityDiv.textContent = this.qrisData.merchantCity || '';

        const orderDiv = document.createElement('div');
        orderDiv.textContent = `Order: ${this.qrisData.orderId || ''}`;

        infoDiv.appendChild(mnDiv);
        infoDiv.appendChild(cityDiv);
        infoDiv.appendChild(orderDiv);
        container.appendChild(infoDiv);
    }

    // Simple QR code drawing function
    drawQRCode(ctx, data, size) {
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // QR code pattern (simplified for demo)
        ctx.fillStyle = '#000000';
        
        // Draw position markers
        const markerSize = size / 8;
        
        // Top-left marker
        ctx.fillRect(10, 10, markerSize, markerSize);
        ctx.clearRect(15, 15, markerSize - 10, markerSize - 10);
        ctx.fillRect(20, 20, markerSize - 20, markerSize - 20);
        
        // Top-right marker
        ctx.fillRect(size - markerSize - 10, 10, markerSize, markerSize);
        ctx.clearRect(size - markerSize - 5, 15, markerSize - 10, markerSize - 10);
        ctx.fillRect(size - markerSize, 20, markerSize - 20, markerSize - 20);
        
        // Bottom-left marker
        ctx.fillRect(10, size - markerSize - 10, markerSize, markerSize);
        ctx.clearRect(15, size - markerSize - 5, markerSize - 10, markerSize - 10);
        ctx.fillRect(20, size - markerSize, markerSize - 20, markerSize - 20);
        
        // Draw data pattern (simplified)
        const dataPoints = this.generateDataPattern(data, size - 40);
        dataPoints.forEach(point => {
            ctx.fillRect(point.x + 20, point.y + 20, 2, 2);
        });
        
        // Add "QRIS" text
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QRIS PAYMENT', size / 2, size - 5);
    }

    // Generate simplified data pattern
    generateDataPattern(data, size) {
        const points = [];
        const dataLength = data.length;
        
        for (let i = 0; i < size; i += 4) {
            for (let j = 0; j < size; j += 4) {
                const charIndex = (i * size / 4 + j) % dataLength;
                const charCode = data.charCodeAt(charIndex);
                
                if (charCode % 2 === 0) {
                    points.push({ x: i, y: j });
                }
            }
        }
        
        return points;
    }

    // Check payment status (simulasi)
    checkPaymentStatus(orderId) {
        return new Promise((resolve) => {
            // Simulate API call to check payment status
            setTimeout(() => {
                // 70% chance of successful payment for demo
                const isPaid = Math.random() > 0.3;
                resolve({
                    success: isPaid,
                    status: isPaid ? 'paid' : 'pending',
                    orderId: orderId,
                    timestamp: new Date().toISOString()
                });
            }, 2000);
        });
    }
}

// Initialize QRIS system
const qrisPayment = new QRISPayment();

// Update payment.js untuk menambahkan QRIS functionality
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // QRIS Payment Method
    const qrisOption = document.querySelector('.payment-option[data-method="qris"]');
    if (qrisOption) {
        qrisOption.addEventListener('click', function() {
            // Update QRIS amount
            const total = calculateTotalAmount();
            document.getElementById('qris-amount').textContent = `Rp ${total.toLocaleString()}`;
            
            // Generate QRIS
            const orderId = 'ZH' + Date.now().toString().slice(-6);
            const qrisString = qrisPayment.generateQRIS(total, orderId);
            qrisPayment.generateQRCode(qrisString, 'qris-code', { size: 180 });
            
            // Start payment status checking
            startQRISPaymentMonitoring(orderId);
        });
    }

    // Function to calculate total amount
    function calculateTotalAmount() {
        const cartItems = JSON.parse(localStorage.getItem('zhalecthCart')) || [];
        let subtotal = 0;
        
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        const shippingCost = 15000;
        const tax = Math.round(subtotal * 0.1);
        
        return subtotal + shippingCost + tax;
    }

    // QRIS Payment Monitoring
    function startQRISPaymentMonitoring(orderId) {
        const checkInterval = setInterval(async () => {
            const paymentStatus = await qrisPayment.checkPaymentStatus(orderId);
            
            if (paymentStatus.success) {
                clearInterval(checkInterval);
                
                // Payment successful
                const successModal = document.getElementById('success-modal');
                if (successModal) {
                    successModal.classList.add('active');
                }
                
                // Save order and clear cart
                const orderData = saveOrderToHistory();
                generateReceiptForOrder(orderData, getCustomerData());
                localStorage.removeItem('zhalecthCart');
            }
        }, 3000); // Check every 3 seconds
        
        // Stop checking after 5 minutes
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 300000);
    }

    // Helper function to get customer data
    function getCustomerData() {
        return {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || '',
            city: document.getElementById('city')?.value || ''
        };
    }
});

// Cek login status saat halaman payment dimuat
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect ke halaman utama jika belum login
        alert('login terlebih dahulu untuk melanjutkan pembayaran');
        window.location.href = 'azhalecth.html';
        return;
    }
    
    // Lanjutkan inisialisasi halaman payment jika sudah login
    // ... kode yang sudah ada ...
});