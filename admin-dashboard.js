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
    
    // Create table for better organization
    ordersList.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID Pesanan</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pembeli</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produk</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sales</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${orders.map(order => {
                        const statusColors = {
                            'Diproses': 'bg-yellow-100 text-yellow-700',
                            'Dalam Pengerjaan': 'bg-blue-100 text-blue-700',
                            'Review': 'bg-purple-100 text-purple-700',
                            'Selesai': 'bg-green-100 text-green-700'
                        };
                        const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-700';
                        
                        // Get sales name from affiliate code
                        const salesUserId = DashboardSystem.getUserByAffiliateCode(order.affiliateCode);
                        const salesData = salesUserId ? DashboardSystem.getUserData(salesUserId) : null;
                        const salesName = salesData ? salesData.name : 'Unknown';
                        
                        return `
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${order.id}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="text-sm font-semibold text-gray-900">${order.customerName}</div>
                                    <div class="text-xs text-gray-500">${order.customerEmail}</div>
                                    ${order.customerPhone ? `<div class="text-xs text-gray-500"><i class="fas fa-phone text-xs mr-1"></i>${order.customerPhone}</div>` : ''}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-sm text-gray-900">${order.productName || 'Website Custom'}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs text-gray-600">${formatDateShort(order.createdAt)}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="text-sm font-medium text-primary">${salesName}</div>
                                    <div class="text-xs text-gray-500">${order.affiliateCode}</div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-sm font-semibold text-gray-900">${formatCurrency(order.amount)}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">${order.status || 'Diproses'}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex gap-1">
                                        <button onclick="viewOrderDetail('${order.id}')" 
                                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                                            title="Lihat Detail">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button onclick="changeOrderStatus('${order.id}', '${order.status}')" 
                                            class="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                                            title="Ubah Status">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        ${order.customerPhone ? `
                                        <button onclick="contactBuyer('${order.customerPhone}', '${order.customerName}')" 
                                            class="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                                            title="Hubungi Pembeli">
                                            <i class="fab fa-whatsapp"></i>
                                        </button>
                                        ` : ''}
                                        <button onclick="deleteOrder('${order.id}')" 
                                            class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                                            title="Hapus Pesanan">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
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

function formatDateShort(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    const bgColors = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'info': 'bg-blue-500'
    };
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `<i class="fas fa-${type === 'error' ? 'times' : 'check'}-circle mr-2"></i>${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// View order detail modal
function viewOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Pesanan tidak ditemukan', 'error');
        return;
    }
    
    const salesUserId = DashboardSystem.getUserByAffiliateCode(order.affiliateCode);
    const salesData = salesUserId ? DashboardSystem.getUserData(salesUserId) : null;
    const salesName = salesData ? salesData.name : 'Unknown';
    const salesEmail = salesData ? salesData.email : 'Unknown';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 class="text-2xl font-jakarta font-bold">Detail Pesanan</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="text-sm text-gray-600">ID Pesanan</label>
                        <div class="font-mono text-sm bg-gray-100 px-3 py-2 rounded mt-1">${order.id}</div>
                    </div>
                    <div>
                        <label class="text-sm text-gray-600">Tanggal Pesanan</label>
                        <div class="font-semibold mt-1">${formatDate(order.createdAt)}</div>
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-6">
                    <h4 class="font-semibold mb-3">Informasi Pembeli</h4>
                    <div class="space-y-2">
                        <div><span class="text-gray-600">Nama:</span> <span class="font-semibold">${order.customerName}</span></div>
                        <div><span class="text-gray-600">Email:</span> <span class="font-semibold">${order.customerEmail}</span></div>
                        ${order.customerPhone ? `<div><span class="text-gray-600">Telepon:</span> <span class="font-semibold">${order.customerPhone}</span></div>` : ''}
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-6">
                    <h4 class="font-semibold mb-3">Informasi Sales</h4>
                    <div class="space-y-2">
                        <div><span class="text-gray-600">Nama Sales:</span> <span class="font-semibold">${salesName}</span></div>
                        <div><span class="text-gray-600">Email Sales:</span> <span class="font-semibold">${salesEmail}</span></div>
                        <div><span class="text-gray-600">Kode Affiliate:</span> <span class="font-mono text-sm bg-blue-100 px-2 py-1 rounded">${order.affiliateCode}</span></div>
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-6">
                    <h4 class="font-semibold mb-3">Detail Produk</h4>
                    <div class="space-y-2">
                        <div><span class="text-gray-600">Produk:</span> <span class="font-semibold">${order.productName || 'Website Custom'}</span></div>
                        <div><span class="text-gray-600">Harga:</span> <span class="font-semibold text-lg text-green-600">${formatCurrency(order.amount)}</span></div>
                        <div><span class="text-gray-600">Status:</span> <span class="font-semibold">${order.status || 'Diproses'}</span></div>
                    </div>
                </div>
                
                ${order.message ? `
                <div class="border-t border-gray-200 pt-4">
                    <h4 class="font-semibold mb-3">Pesan/Catatan</h4>
                    <div class="bg-gray-50 p-3 rounded-lg text-sm">${order.message}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Change order status
function changeOrderStatus(orderId, currentStatus) {
    const statuses = ['Diproses', 'Dalam Pengerjaan', 'Review', 'Selesai'];
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 class="text-xl font-jakarta font-bold mb-4">Ubah Status Pesanan</h3>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status Saat Ini: <span class="font-semibold text-primary">${currentStatus || 'Diproses'}</span></label>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Status Baru:</label>
                <select id="new-status-select" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    ${statuses.map(s => `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </div>
            <div class="flex gap-3">
                <button onclick="confirmStatusChange('${orderId}')" class="flex-1 btn-primary px-4 py-2 rounded-lg font-medium">
                    Simpan
                </button>
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                    Batal
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmStatusChange(orderId) {
    const newStatus = document.getElementById('new-status-select').value;
    DashboardSystem.updateOrderStatus(orderId, newStatus);
    document.querySelector('.fixed.inset-0').remove();
    showNotification('Status pesanan berhasil diubah!');
    const startDate = document.getElementById('admin-start-date').value || null;
    const endDate = document.getElementById('admin-end-date').value || null;
    loadAdminData(startDate, endDate);
}

// Delete order
function deleteOrder(orderId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-6">
            <div class="text-center mb-4">
                <div class="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                </div>
                <h3 class="text-xl font-jakarta font-bold mb-2">Hapus Pesanan?</h3>
                <p class="text-gray-600">Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div class="flex gap-3">
                <button onclick="confirmDeleteOrder('${orderId}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
                    Ya, Hapus
                </button>
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                    Batal
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmDeleteOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
    const filteredOrders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('affiliateOrders', JSON.stringify(filteredOrders));
    document.querySelector('.fixed.inset-0').remove();
    showNotification('Pesanan berhasil dihapus!', 'success');
    const startDate = document.getElementById('admin-start-date').value || null;
    const endDate = document.getElementById('admin-end-date').value || null;
    loadAdminData(startDate, endDate);
}

// Contact buyer via WhatsApp
function contactBuyer(phoneNumber, customerName) {
    // Clean phone number (remove spaces, dashes, etc.)
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // If phone starts with 0, replace with 62
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.substring(1);
    }
    // If phone doesn't start with 62, add it
    if (!cleanPhone.startsWith('62')) {
        cleanPhone = '62' + cleanPhone;
    }
    
    const message = encodeURIComponent(`Halo ${customerName}, saya dari tim SitusKita mengenai pesanan website Anda.`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}

// Export functions
window.initAdminDashboard = initAdminDashboard;
window.editCommission = editCommission;
window.updateOrderStatus = updateOrderStatus;
window.applyAdminFilter = applyAdminFilter;
window.clearAdminFilter = clearAdminFilter;
window.viewOrderDetail = viewOrderDetail;
window.changeOrderStatus = changeOrderStatus;
window.confirmStatusChange = confirmStatusChange;
window.deleteOrder = deleteOrder;
window.confirmDeleteOrder = confirmDeleteOrder;
window.contactBuyer = contactBuyer;
