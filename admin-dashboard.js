// Admin Dashboard Functions

function initAdminDashboard(userEmail) {
    console.log('🔹 Admin mode activated for:', userEmail);
    document.body.classList.add('admin-mode');
    
    // Initialize admin user
    DashboardSystem.initializeUser(userEmail);
    
    // Update header
    const headerTitle = document.querySelector('main h1');
    if (headerTitle) {
        headerTitle.innerHTML = 'Dashboard <span class="text-gradient">Admin</span>';
    }
    
    const headerSubtitle = document.querySelector('main h1 + p');
    if (headerSubtitle) {
        headerSubtitle.textContent = 'Kelola seluruh affiliate sales dan statistik platform';
    }
    
    // Show admin panel
    renderAdminPanel();
}

function renderAdminPanel() {
    const mainContent = document.querySelector('#affiliate-content > div');
    if (!mainContent) return;
    
    // Clear existing content
    mainContent.innerHTML = '';
    
    // Admin Header
    const adminHeader = document.createElement('div');
    adminHeader.className = 'bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 text-white mb-6 md:mb-8';
    adminHeader.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div>
                <h2 class="text-2xl md:text-3xl font-jakarta font-bold mb-1 md:mb-2">Panel Admin</h2>
                <p class="text-xs md:text-sm opacity-90">Kelola sales team dan statistik affiliate</p>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base">
                <i class="fas fa-crown text-yellow-300 mr-1 md:mr-2"></i>
                <span class="font-semibold">Administrator</span>
            </div>
        </div>
    `;
    mainContent.appendChild(adminHeader);
    
    // Date Filter
    const dateFilter = document.createElement('div');
    dateFilter.className = 'bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8';
    dateFilter.innerHTML = `
        <div class="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end">
            <div class="flex-1">
                <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2">Tanggal Mulai</label>
                <input type="date" id="admin-start-date" class="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex-1">
                <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2">Tanggal Akhir</label>
                <input type="date" id="admin-end-date" class="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex gap-2 md:gap-4">
                <button onclick="applyAdminFilter()" class="flex-1 md:flex-none btn-primary px-4 md:px-6 py-2 rounded-lg font-medium whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-filter mr-1 md:mr-2"></i>Filter
                </button>
                <button onclick="clearAdminFilter()" class="flex-1 md:flex-none bg-gray-200 text-text-dark px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-gray-300 whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-times mr-1 md:mr-2"></i>Reset
                </button>
            </div>
        </div>
    `;
    mainContent.appendChild(dateFilter);
    
    // Statistics Cards
    const statsCards = document.createElement('div');
    statsCards.id = 'admin-stats';
    statsCards.className = 'mb-8';
    mainContent.appendChild(statsCards);
    
    // Sales Management
    const salesManagement = document.createElement('div');
    salesManagement.className = 'bg-white rounded-2xl shadow-lg p-8 mb-8';
    salesManagement.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-jakarta font-bold">Manajemen Sales</h2>
        </div>
        <div id="sales-list-admin"></div>
    `;
    mainContent.appendChild(salesManagement);
    
    // Orders Management
    const ordersManagement = document.createElement('div');
    ordersManagement.className = 'bg-white rounded-2xl shadow-lg p-8 mb-8';
    ordersManagement.innerHTML = `
        <h2 class="text-2xl font-jakarta font-bold mb-6">Semua Pesanan</h2>
        <div id="all-orders-list"></div>
    `;
    mainContent.appendChild(ordersManagement);
    
    // Load initial data
    loadAdminData();
}

function loadAdminData(startDate = null, endDate = null) {
    // Load statistics
    const stats = DashboardSystem.getAdminStats(startDate, endDate);
    
    const statsHTML = `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Sales</div>
                <div class="text-xl md:text-3xl font-bold text-blue-600">${stats.totalSales}</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Klik</div>
                <div class="text-xl md:text-3xl font-bold text-purple-600">${stats.totalClicks}</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Order</div>
                <div class="text-xl md:text-3xl font-bold text-green-600">${stats.totalOrders}</div>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Buyer</div>
                <div class="text-xl md:text-3xl font-bold text-yellow-600">${stats.uniqueBuyers}</div>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Revenue</div>
                <div class="text-sm md:text-xl font-bold text-red-600 truncate">${formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg md:rounded-xl p-3 md:p-6">
                <div class="text-xs md:text-sm text-text-light mb-1 md:mb-2">Total Komisi</div>
                <div class="text-sm md:text-xl font-bold text-indigo-600 truncate">${formatCurrency(stats.totalCommission)}</div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-stats').innerHTML = statsHTML;
    
    // Load sales list
    loadSalesList();
    
    // Load all orders
    loadAllOrders(startDate, endDate);
}

function loadSalesList() {
    const users = DashboardSystem.getAllUsers();
    const salesList = document.getElementById('sales-list-admin');
    
    if (users.length === 0) {
        salesList.innerHTML = `
            <div class="text-center py-8 text-text-light">
                <i class="fas fa-users text-4xl mb-4 opacity-50"></i>
                <p>Belum ada sales terdaftar</p>
            </div>
        `;
        return;
    }
    
    salesList.innerHTML = users.map(user => {
        const stats = DashboardSystem.getAffiliateStats(user.affiliateCode);
        return `
            <div class="border border-gray-200 rounded-lg p-4 md:p-6 mb-4 hover:border-primary transition-colors">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-semibold text-lg truncate">${user.name}</h3>
                            <p class="text-sm text-text-light truncate">${user.email}</p>
                            <p class="text-sm text-primary font-mono mt-1">${user.affiliateCode}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div class="text-center">
                            <div class="text-text-light">Klik</div>
                            <div class="font-semibold">${stats.totalClicks}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-text-light">Order</div>
                            <div class="font-semibold">${stats.totalOrders}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-text-light">Komisi</div>
                            <div class="font-semibold text-green-600">${user.commissionRate}%</div>
                        </div>
                        <div class="text-center">
                            <button onclick="editCommission('${user.id}', ${user.commissionRate})" 
                                class="text-primary hover:text-primary-dark font-medium">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadAllOrders(startDate = null, endDate = null) {
    const orders = DashboardSystem.getAllOrders(startDate, endDate);
    const ordersList = document.getElementById('all-orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="text-center py-8 text-text-light">
                <i class="fas fa-inbox text-4xl mb-4 opacity-50"></i>
                <p>Belum ada pesanan</p>
            </div>
        `;
        return;
    }
    
    // Sort by date descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ordersList.innerHTML = orders.map(order => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-700',
            'dikirim': 'bg-blue-100 text-blue-700',
            'selesai': 'bg-green-100 text-green-700'
        };
        
        return `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 hover:border-primary transition-colors">
                <div class="flex flex-col md:flex-row justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${order.id}</span>
                            <span class="text-xs text-primary">${order.affiliateCode}</span>
                        </div>
                        <p class="font-semibold">${order.customerName}</p>
                        <p class="text-sm text-text-light">${order.customerEmail}</p>
                        <p class="text-sm text-text-light mt-1">${order.productName || 'Website Custom'}</p>
                        <p class="text-xs text-text-light mt-1">${formatDate(order.createdAt)}</p>
                    </div>
                    <div class="flex flex-col items-end justify-between gap-2">
                        <div class="text-right">
                            <div class="font-semibold text-lg">${formatCurrency(order.amount)}</div>
                        </div>
                        <select onchange="updateOrderStatus('${order.id}', this.value)" 
                            class="px-3 py-1 rounded-lg text-sm font-medium ${statusColors[order.status] || statusColors.pending}">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="dikirim" ${order.status === 'dikirim' ? 'selected' : ''}>Dikirim</option>
                            <option value="selesai" ${order.status === 'selesai' ? 'selected' : ''}>Selesai</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function editCommission(userId, currentRate) {
    const newRate = prompt(`Masukkan rate komisi baru (%):\nRate saat ini: ${currentRate}%`, currentRate);
    if (newRate !== null && !isNaN(newRate) && newRate >= 0 && newRate <= 100) {
        DashboardSystem.updateCommissionRate(userId, parseFloat(newRate));
        loadSalesList();
        showNotification('Rate komisi berhasil diperbarui!');
    }
}

function updateOrderStatus(orderId, newStatus) {
    DashboardSystem.updateOrderStatus(orderId, newStatus);
    showNotification('Status pesanan berhasil diperbarui!');
    const startDate = document.getElementById('admin-start-date').value || null;
    const endDate = document.getElementById('admin-end-date').value || null;
    loadAdminData(startDate, endDate);
}

function applyAdminFilter() {
    const startDate = document.getElementById('admin-start-date').value || null;
    const endDate = document.getElementById('admin-end-date').value || null;
    loadAdminData(startDate, endDate);
}

function clearAdminFilter() {
    document.getElementById('admin-start-date').value = '';
    document.getElementById('admin-end-date').value = '';
    loadAdminData();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions
window.initAdminDashboard = initAdminDashboard;
window.editCommission = editCommission;
window.updateOrderStatus = updateOrderStatus;
window.applyAdminFilter = applyAdminFilter;
window.clearAdminFilter = clearAdminFilter;
