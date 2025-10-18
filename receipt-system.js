// Sistem Generate Resi Otomatis
class ReceiptSystem {
    constructor() {
        this.couriers = {
            'jne': {
                name: 'JNE',
                trackingUrl: 'https://www.jne.co.id/tracking/trace',
                rates: {
                    regular: 15000,
                    express: 25000,
                    sameDay: 40000
                }
            },
            'tiki': {
                name: 'TIKI',
                trackingUrl: 'https://www.tiki.id/tracking',
                rates: {
                    regular: 16000,
                    express: 26000,
                    overnight: 35000
                }
            },
            'pos': {
                name: 'POS Indonesia',
                trackingUrl: 'https://www.posindonesia.co.id/tracking',
                rates: {
                    regular: 12000,
                    express: 20000,
                    logistics: 18000
                }
            },
            'jnt': {
                name: 'J&T Express',
                trackingUrl: 'https://jet.co.id/tracking',
                rates: {
                    regular: 14000,
                    express: 22000,
                    cargo: 30000
                }
            },
            'sicepat': {
                name: 'SiCepat',
                trackingUrl: 'https://www.sicepat.com/tracking',
                rates: {
                    regular: 13000,
                    express: 21000,
                    super: 28000
                }
            }
        };
    }

    // Generate nomor resi unik
    generateReceiptNumber(courierCode) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const courierPrefix = courierCode.toUpperCase();
        
        return `${courierPrefix}${timestamp}${random}ID`;
    }

    // Generate data resi lengkap
    generateReceipt(orderData, customerData, courierCode = 'jne', serviceType = 'regular') {
        const courier = this.couriers[courierCode];
        const receiptNumber = this.generateReceiptNumber(courierCode);
        
        const receipt = {
            receiptNumber: receiptNumber,
            orderId: orderData.id,
            courier: {
                code: courierCode,
                name: courier.name,
                service: serviceType,
                trackingUrl: `${courier.trackingUrl}?q=${receiptNumber}`
            },
            shipping: {
                cost: courier.rates[serviceType] || courier.rates.regular,
                estimatedDelivery: this.calculateEstimatedDelivery(courierCode, serviceType),
                weight: this.calculateTotalWeight(orderData.items),
                dimensions: this.calculateDimensions(orderData.items)
            },
            sender: {
                name: 'PT. ZHALECTH INDONESIA',
                address: 'Jl. Fashion Center No. 123, Serang',
                city: 'Serang',
                phone: '+62 895 3007 6818'
            },
            receiver: {
                name: customerData.name,
                address: customerData.address,
                city: customerData.city,
                phone: customerData.phone,
                email: customerData.email
            },
            items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                weight: 0.3, // kg per item (estimasi)
                price: item.price
            })),
            generatedAt: new Date().toISOString(),
            status: 'shipment_created',
            statusHistory: [
                {
                    status: 'shipment_created',
                    description: 'Resi telah dibuat',
                    timestamp: new Date().toISOString(),
                    location: 'Gudang Zhalecth Serang'
                }
            ]
        };

        return receipt;
    }

    // Hitung estimasi pengiriman
    calculateEstimatedDelivery(courierCode, serviceType) {
        const baseDays = {
            'jne': { regular: 3, express: 2, sameDay: 1 },
            'tiki': { regular: 3, express: 2, overnight: 1 },
            'pos': { regular: 4, express: 2, logistics: 3 },
            'jnt': { regular: 3, express: 2, cargo: 4 },
            'sicepat': { regular: 3, express: 2, super: 2 }
        };

        const days = baseDays[courierCode]?.[serviceType] || 3;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        
        return deliveryDate.toISOString();
    }

    // Hitung total berat
    calculateTotalWeight(items) {
        const itemWeight = 0.3; // kg per item
        return items.reduce((total, item) => total + (item.quantity * itemWeight), 0);
    }

    // Hitung dimensi paket
    calculateDimensions(items) {
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems <= 2) {
            return { length: 30, width: 20, height: 10 }; // kecil
        } else if (totalItems <= 5) {
            return { length: 40, width: 30, height: 15 }; // sedang
        } else {
            return { length: 50, width: 40, height: 20 }; // besar
        }
    }

    // Update status pengiriman
    updateShippingStatus(receiptNumber, newStatus, location = '') {
        const receipts = JSON.parse(localStorage.getItem('zhalecthReceipts')) || [];
        const receiptIndex = receipts.findIndex(r => r.receiptNumber === receiptNumber);
        
        if (receiptIndex !== -1) {
            const statusInfo = this.getStatusInfo(newStatus, location);
            receipts[receiptIndex].status = newStatus;
            receipts[receiptIndex].statusHistory.unshift(statusInfo);
            
            localStorage.setItem('zhalecthReceipts', JSON.stringify(receipts));
            return true;
        }
        
        return false;
    }

    // Info status pengiriman
    getStatusInfo(status, location = '') {
        const statusMessages = {
            'shipment_created': {
                description: 'Resi telah dibuat',
                defaultLocation: 'Gudang Zhalecth Serang'
            },
            'package_received': {
                description: 'Paket telah diterima oleh kurir',
                defaultLocation: 'Kantor Pusat Kurir'
            },
            'in_transit': {
                description: 'Paket sedang dalam perjalanan',
                defaultLocation: 'Pusat Distribusi'
            },
            'out_for_delivery': {
                description: 'Paket sedang diantar ke alamat tujuan',
                defaultLocation: 'Kantor Cabang Tujuan'
            },
            'delivered': {
                description: 'Paket telah diterima oleh penerima',
                defaultLocation: 'Alamat Penerima'
            },
            'failed_delivery': {
                description: 'Gagal mengantar paket',
                defaultLocation: 'Kantor Cabang Tujuan'
            }
        };

        const statusInfo = statusMessages[status] || {
            description: 'Status tidak diketahui',
            defaultLocation: 'Lokasi tidak diketahui'
        };

        return {
            status: status,
            description: statusInfo.description,
            timestamp: new Date().toISOString(),
            location: location || statusInfo.defaultLocation
        };
    }

    // Simpan resi ke localStorage
    saveReceipt(receipt) {
        const receipts = JSON.parse(localStorage.getItem('zhalecthReceipts')) || [];
        receipts.push(receipt);
        localStorage.setItem('zhalecthReceipts', JSON.stringify(receipts));
        return receipt;
    }

    // Dapatkan resi berdasarkan order ID
    getReceiptByOrderId(orderId) {
        const receipts = JSON.parse(localStorage.getItem('zhalecthReceipts')) || [];
        return receipts.find(receipt => receipt.orderId === orderId);
    }

    // Dapatkan semua resi
    getAllReceipts() {
        return JSON.parse(localStorage.getItem('zhalecthReceipts')) || [];
    }

    // Generate PDF receipt (simulasi)
    generatePDFReceipt(receiptData) {
        // Dalam implementasi nyata, ini akan generate PDF
        // Untuk sekarang kita return URL download simulasi
        return {
            pdfUrl: `#`,
            receiptNumber: receiptData.receiptNumber,
            downloadDate: new Date().toISOString()
        };
    }
}

// Inisialisasi sistem resi
const receiptSystem = new ReceiptSystem();