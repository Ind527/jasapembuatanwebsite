// Order Tracking System - Frontend Only with localStorage
class OrderTrackingSystem {
    constructor() {
        this.storageKey = 'orderTrackingData';
        this.init();
    }

    init() {
        // Initialize with demo orders if not exists
        if (!localStorage.getItem(this.storageKey)) {
            this.createDemoOrders();
        }
    }

    createDemoOrders() {
        const demoOrders = [
            {
                orderNumber: 'ORD00123',
                customerName: 'Budi Santoso',
                productType: 'Website Company Profile',
                status: 'Selesai',
                orderDate: '2025-10-15',
                completionDate: '2025-10-28',
                amount: 3500000,
                timeline: [
                    { status: 'Diproses', date: '2025-10-15', description: 'Pesanan diterima dan sedang diverifikasi' },
                    { status: 'Dalam Pengerjaan', date: '2025-10-18', description: 'Tim development mulai mengerjakan website' },
                    { status: 'Review', date: '2025-10-25', description: 'Website selesai dan menunggu review client' },
                    { status: 'Selesai', date: '2025-10-28', description: 'Website telah selesai dan diserahkan ke client' }
                ]
            },
            {
                orderNumber: 'ORD00124',
                customerName: 'Siti Nurhaliza',
                productType: 'Website Toko Online',
                status: 'Dalam Pengerjaan',
                orderDate: '2025-10-20',
                completionDate: null,
                amount: 5000000,
                timeline: [
                    { status: 'Diproses', date: '2025-10-20', description: 'Pesanan diterima dan sedang diverifikasi' },
                    { status: 'Dalam Pengerjaan', date: '2025-10-22', description: 'Tim development sedang mengerjakan sistem e-commerce' }
                ]
            },
            {
                orderNumber: 'ORD00125',
                customerName: 'Ahmad Wijaya',
                productType: 'Website Landing Page',
                status: 'Diproses',
                orderDate: '2025-11-01',
                completionDate: null,
                amount: 2500000,
                timeline: [
                    { status: 'Diproses', date: '2025-11-01', description: 'Pesanan diterima, menunggu pembayaran dan konfirmasi' }
                ]
            },
            {
                orderNumber: 'ORD00126',
                customerName: 'Lisa Permata',
                productType: 'Website Portfolio',
                status: 'Selesai',
                orderDate: '2025-10-10',
                completionDate: '2025-10-20',
                amount: 2800000,
                timeline: [
                    { status: 'Diproses', date: '2025-10-10', description: 'Pesanan diterima' },
                    { status: 'Dalam Pengerjaan', date: '2025-10-12', description: 'Desain dan development dimulai' },
                    { status: 'Selesai', date: '2025-10-20', description: 'Portfolio website selesai dan online' }
                ]
            },
            {
                orderNumber: 'ORD00127',
                customerName: 'Rudi Hartono',
                productType: 'Website Restaurant',
                status: 'Dikirim',
                orderDate: '2025-10-25',
                completionDate: '2025-11-02',
                amount: 4200000,
                timeline: [
                    { status: 'Diproses', date: '2025-10-25', description: 'Pesanan diterima' },
                    { status: 'Dalam Pengerjaan', date: '2025-10-27', description: 'Development website restaurant' },
                    { status: 'Selesai', date: '2025-11-01', description: 'Website selesai dikerjakan' },
                    { status: 'Dikirim', date: '2025-11-02', description: 'Login credentials dan dokumentasi dikirim ke email client' }
                ]
            }
        ];
        
        localStorage.setItem(this.storageKey, JSON.stringify(demoOrders));
    }

    getAllOrders() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    findOrder(orderNumber) {
        const orders = this.getAllOrders();
        return orders.find(order => order.orderNumber.toUpperCase() === orderNumber.toUpperCase());
    }

    addOrder(orderData) {
        const orders = this.getAllOrders();
        orders.push(orderData);
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
        return true;
    }

    updateOrderStatus(orderNumber, newStatus, description) {
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
        
        if (orderIndex === -1) return false;
        
        const order = orders[orderIndex];
        order.status = newStatus;
        order.timeline.push({
            status: newStatus,
            date: new Date().toISOString().split('T')[0],
            description: description || `Status berubah menjadi ${newStatus}`
        });
        
        if (newStatus === 'Selesai' || newStatus === 'Dikirim') {
            order.completionDate = new Date().toISOString().split('T')[0];
        }
        
        orders[orderIndex] = order;
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
        return true;
    }

    getStatusColor(status) {
        const colors = {
            'Diproses': 'bg-yellow-100 text-yellow-800',
            'Dalam Pengerjaan': 'bg-blue-100 text-blue-800',
            'Review': 'bg-purple-100 text-purple-800',
            'Selesai': 'bg-green-100 text-green-800',
            'Dikirim': 'bg-indigo-100 text-indigo-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusIcon(status) {
        const icons = {
            'Diproses': '⏳',
            'Dalam Pengerjaan': '🔨',
            'Review': '👀',
            'Selesai': '✅',
            'Dikirim': '📦'
        };
        return icons[status] || '📋';
    }

    resetOrders() {
        localStorage.removeItem(this.storageKey);
        this.createDemoOrders();
    }
}

// Initialize order tracking system
const orderTrackingSystem = new OrderTrackingSystem();
