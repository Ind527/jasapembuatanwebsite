// Sales Dashboard Functions

function initSalesDashboard(userEmail) {
    console.log('🔹 Sales mode activated for:', userEmail);
    document.body.classList.add('sales-mode');
    
    // Initialize user and get affiliate code
    const userData = DashboardSystem.initializeUser(userEmail);
    
    // Render sales dashboard
    renderSalesDashboard(userData);
}

function renderSalesDashboard(userData) {
    const mainContent = document.querySelector('#affiliate-content > div');
    if (!mainContent) return;
    
    // Clear existing content
    mainContent.innerHTML = '';
    
    // Sales Header
    const salesHeader = document.createElement('div');
    salesHeader.className = 'text-center mb-8';
    salesHeader.innerHTML = `
        <h1 class="text-4xl lg:text-5xl font-jakarta font-bold mb-4">
            Dashboard <span class="text-gradient">Sales</span>
        </h1>
        <p class="text-xl text-text-light max-w-2xl mx-auto">
            Dapatkan komisi ${userData.commissionRate}% dari setiap referral yang berhasil order website
        </p>
    `;
    mainContent.appendChild(salesHeader);
    
    // Date Filter
    const dateFilter = document.createElement('div');
    dateFilter.className = 'bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8';
    dateFilter.innerHTML = `
        <div class="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end">
            <div class="flex-1">
                <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2">Tanggal Mulai</label>
                <input type="date" id="sales-start-date" class="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex-1">
                <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2">Tanggal Akhir</label>
                <input type="date" id="sales-end-date" class="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex gap-2 md:gap-4">
                <button onclick="applySalesFilter('${userData.affiliateCode}')" class="flex-1 md:flex-none btn-primary px-4 md:px-6 py-2 rounded-lg font-medium whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-filter mr-1 md:mr-2"></i>Filter
                </button>
                <button onclick="clearSalesFilter('${userData.affiliateCode}')" class="flex-1 md:flex-none bg-gray-200 text-text-dark px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-gray-300 whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-times mr-1 md:mr-2"></i>Reset
                </button>
            </div>
        </div>
    `;
    mainContent.appendChild(dateFilter);
    
    // Referral Link Section
    const referralSection = document.createElement('div');
    referralSection.className = 'bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8';
    const referralLink = `${window.location.origin}/contact.html?ref=${userData.affiliateCode}#form-konsultasi`;
    referralSection.innerHTML = `
        <h2 class="text-xl md:text-2xl font-jakarta font-bold mb-4 md:mb-6">Link Referral Anda</h2>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-6 rounded-lg md:rounded-xl mb-3 md:mb-4">
            <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2">Kode Affiliate Anda</label>
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 mb-3 md:mb-4">
                <input type="text" id="affiliate-code" readonly value="${userData.affiliateCode}"
                    class="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg font-mono text-base md:text-lg font-semibold">
                <button onclick="copyToClipboard('affiliate-code', 'Kode affiliate berhasil disalin!')" 
                    class="btn-secondary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-copy mr-1 md:mr-2"></i> Salin Kode
                </button>
            </div>
            
            <label class="block text-xs md:text-sm font-medium text-text-light mb-1 md:mb-2 mt-4 md:mt-6">Link Referral Lengkap</label>
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
                <input type="text" id="referral-link" readonly value="${referralLink}"
                    class="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg text-xs md:text-sm break-all">
                <button onclick="copyToClipboard('referral-link', 'Link referral berhasil disalin!')" 
                    class="btn-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium whitespace-nowrap text-sm md:text-base">
                    <i class="fas fa-link mr-1 md:mr-2"></i> Salin Link
                </button>
            </div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
            <p class="text-xs md:text-sm text-blue-800">
                <i class="fas fa-info-circle mr-1 md:mr-2"></i>
                Bagikan link referral Anda ke teman, keluarga, atau media sosial. Anda akan mendapatkan komisi ${userData.commissionRate}% dari setiap pembelian yang menggunakan link Anda!
            </p>
        </div>
    `;
    mainContent.appendChild(referralSection);
    
    // Statistics Container
    const statsContainer = document.createElement('div');
    statsContainer.id = 'sales-stats';
    mainContent.appendChild(statsContainer);
    
    // Orders Container
    const ordersContainer = document.createElement('div');
    ordersContainer.className = 'bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8';
    ordersContainer.innerHTML = `
        <h2 class="text-2xl font-jakarta font-bold mb-6">Pesanan dari Referral Anda</h2>
        <div id="sales-orders-list"></div>
    `;
    mainContent.appendChild(ordersContainer);
    
    
    // Load sales data
    loadSalesData(userData.affiliateCode);
}

function loadSalesData(affiliateCode, startDate = null, endDate = null) {
    const stats = DashboardSystem.getAffiliateStats(affiliateCode, startDate, endDate);
    
    // Render statistics cards
    const statsHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
            <div class="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-2 md:mb-4">
                    <div class="bg-blue-100 p-2 md:p-3 rounded-lg">
                        <i class="fas fa-mouse-pointer text-base md:text-2xl text-blue-600"></i>
                    </div>
                </div>
                <h3 class="text-xl md:text-3xl font-bold mb-1 md:mb-2">${stats.totalClicks}</h3>
                <p class="text-text-light text-xs md:text-sm">Total Klik</p>
            </div>
            <div class="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-2 md:mb-4">
                    <div class="bg-green-100 p-2 md:p-3 rounded-lg">
                        <i class="fas fa-shopping-cart text-base md:text-2xl text-green-600"></i>
                    </div>
                </div>
                <h3 class="text-xl md:text-3xl font-bold mb-1 md:mb-2">${stats.totalOrders}</h3>
                <p class="text-text-light text-xs md:text-sm">Total Order</p>
            </div>
            <div class="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-2 md:mb-4">
                    <div class="bg-purple-100 p-2 md:p-3 rounded-lg">
                        <i class="fas fa-dollar-sign text-base md:text-2xl text-purple-600"></i>
                    </div>
                </div>
                <h3 class="text-sm md:text-2xl font-bold mb-1 md:mb-2 truncate">${formatCurrency(stats.totalRevenue)}</h3>
                <p class="text-text-light text-xs md:text-sm">Total Revenue</p>
            </div>
            <div class="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-2 md:mb-4">
                    <div class="bg-yellow-100 p-2 md:p-3 rounded-lg">
                        <i class="fas fa-money-bill-wave text-base md:text-2xl text-yellow-600"></i>
                    </div>
                </div>
                <h3 class="text-sm md:text-2xl font-bold mb-1 md:mb-2 truncate">${formatCurrency(stats.totalCommission)}</h3>
                <p class="text-text-light text-xs md:text-sm">Komisi (${stats.commissionRate}%)</p>
            </div>
        </div>
    `;
    
    document.getElementById('sales-stats').innerHTML = statsHTML;
    
    // Render orders table
    const ordersList = document.getElementById('sales-orders-list');
    if (stats.orders.length === 0) {
        ordersList.innerHTML = `
            <div class="text-center py-8 text-text-light">
                <i class="fas fa-inbox text-4xl mb-4 opacity-50"></i>
                <p>Belum ada pesanan dari referral Anda</p>
            </div>
        `;
    } else {
        const statusColors = {
            'Diproses': 'bg-yellow-100 text-yellow-700',
            'Dalam Pengerjaan': 'bg-blue-100 text-blue-700',
            'Review': 'bg-purple-100 text-purple-700',
            'Selesai': 'bg-green-100 text-green-700'
        };
        
        ordersList.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID Pesanan</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pembeli</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produk</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Komisi</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${stats.orders.map(order => {
                            const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-700';
                            const commission = order.amount * (stats.commissionRate / 100);
                            
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
                                        <span class="text-sm font-semibold text-gray-900">${formatCurrency(order.amount)}</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="text-sm font-semibold text-green-600">${formatCurrency(commission)}</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">${order.status || 'Diproses'}</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex gap-1">
                                            <button onclick="viewSalesOrderDetail('${order.id}')" 
                                                class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                                                title="Lihat Detail">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            ${order.customerPhone ? `
                                            <button onclick="contactSalesBuyer('${order.customerPhone}', '${order.customerName}')" 
                                                class="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                                                title="Hubungi Pembeli">
                                                <i class="fab fa-whatsapp"></i>
                                            </button>
                                            ` : ''}
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
}

function applySalesFilter(affiliateCode) {
    const startDate = document.getElementById('sales-start-date').value || null;
    const endDate = document.getElementById('sales-end-date').value || null;
    loadSalesData(affiliateCode, startDate, endDate);
}

function clearSalesFilter(affiliateCode) {
    document.getElementById('sales-start-date').value = '';
    document.getElementById('sales-end-date').value = '';
    loadSalesData(affiliateCode);
}

function copyToClipboard(elementId, successMessage) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    showNotification(successMessage);
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
        year: 'numeric'
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

// View order detail for sales
function viewSalesOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Pesanan tidak ditemukan', 'error');
        return;
    }
    
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

// Contact buyer via WhatsApp for sales
function contactSalesBuyer(phoneNumber, customerName) {
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
window.initSalesDashboard = initSalesDashboard;
window.applySalesFilter = applySalesFilter;
window.clearSalesFilter = clearSalesFilter;
window.copyToClipboard = copyToClipboard;
window.viewSalesOrderDetail = viewSalesOrderDetail;
window.contactSalesBuyer = contactSalesBuyer;
