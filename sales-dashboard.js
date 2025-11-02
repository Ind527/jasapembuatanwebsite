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
    dateFilter.className = 'bg-white rounded-2xl shadow-lg p-6 mb-8';
    dateFilter.innerHTML = `
        <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
                <label class="block text-sm font-medium text-text-light mb-2">Tanggal Mulai</label>
                <input type="date" id="sales-start-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-text-light mb-2">Tanggal Akhir</label>
                <input type="date" id="sales-end-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <button onclick="applySalesFilter('${userData.affiliateCode}')" class="btn-primary px-6 py-2 rounded-lg font-medium whitespace-nowrap">
                <i class="fas fa-filter mr-2"></i>Filter
            </button>
            <button onclick="clearSalesFilter('${userData.affiliateCode}')" class="bg-gray-200 text-text-dark px-6 py-2 rounded-lg font-medium hover:bg-gray-300 whitespace-nowrap">
                <i class="fas fa-times mr-2"></i>Reset
            </button>
        </div>
    `;
    mainContent.appendChild(dateFilter);
    
    // Referral Link Section
    const referralSection = document.createElement('div');
    referralSection.className = 'bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8';
    const referralLink = `${window.location.origin}/?ref=${userData.affiliateCode}`;
    referralSection.innerHTML = `
        <h2 class="text-2xl font-jakarta font-bold mb-6">Link Referral Anda</h2>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl mb-4">
            <label class="block text-sm font-medium text-text-light mb-2">Kode Affiliate Anda</label>
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-4">
                <input type="text" id="affiliate-code" readonly value="${userData.affiliateCode}"
                    class="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-lg font-semibold">
                <button onclick="copyToClipboard('affiliate-code', 'Kode affiliate berhasil disalin!')" 
                    class="btn-secondary px-6 py-3 rounded-lg font-medium whitespace-nowrap">
                    <i class="fas fa-copy mr-2"></i> Salin Kode
                </button>
            </div>
            
            <label class="block text-sm font-medium text-text-light mb-2 mt-6">Link Referral Lengkap</label>
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <input type="text" id="referral-link" readonly value="${referralLink}"
                    class="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm">
                <button onclick="copyToClipboard('referral-link', 'Link referral berhasil disalin!')" 
                    class="btn-primary px-6 py-3 rounded-lg font-medium whitespace-nowrap">
                    <i class="fas fa-link mr-2"></i> Salin Link
                </button>
            </div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
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
    
    // How It Works
    const howItWorks = document.createElement('div');
    howItWorks.className = 'bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 md:p-8 text-white';
    howItWorks.innerHTML = `
        <h2 class="text-2xl font-jakarta font-bold mb-6 text-center">Cara Kerja Program Affiliate</h2>
        <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span class="text-3xl font-bold">1</span>
                </div>
                <h3 class="font-bold mb-2">Bagikan Link</h3>
                <p class="text-sm opacity-90">Salin dan bagikan link referral Anda ke teman, keluarga, atau media sosial</p>
            </div>
            <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span class="text-3xl font-bold">2</span>
                </div>
                <h3 class="font-bold mb-2">Mereka Order</h3>
                <p class="text-sm opacity-90">Ketika ada yang order melalui link Anda, kami akan mencatatnya</p>
            </div>
            <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span class="text-3xl font-bold">3</span>
                </div>
                <h3 class="font-bold mb-2">Dapatkan Komisi</h3>
                <p class="text-sm opacity-90">Anda mendapatkan komisi ${userData.commissionRate}% dari nilai order yang berhasil</p>
            </div>
        </div>
    `;
    mainContent.appendChild(howItWorks);
    
    // Load sales data
    loadSalesData(userData.affiliateCode);
}

function loadSalesData(affiliateCode, startDate = null, endDate = null) {
    const stats = DashboardSystem.getAffiliateStats(affiliateCode, startDate, endDate);
    
    // Render statistics cards
    const statsHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-blue-100 p-3 rounded-lg">
                        <i class="fas fa-mouse-pointer text-xl md:text-2xl text-blue-600"></i>
                    </div>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold mb-2">${stats.totalClicks}</h3>
                <p class="text-text-light text-sm">Total Klik</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-green-100 p-3 rounded-lg">
                        <i class="fas fa-shopping-cart text-xl md:text-2xl text-green-600"></i>
                    </div>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold mb-2">${stats.totalOrders}</h3>
                <p class="text-text-light text-sm">Total Order</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-purple-100 p-3 rounded-lg">
                        <i class="fas fa-dollar-sign text-xl md:text-2xl text-purple-600"></i>
                    </div>
                </div>
                <h3 class="text-lg md:text-2xl font-bold mb-2">${formatCurrency(stats.totalRevenue)}</h3>
                <p class="text-text-light text-sm">Total Revenue</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <div class="bg-yellow-100 p-3 rounded-lg">
                        <i class="fas fa-money-bill-wave text-xl md:text-2xl text-yellow-600"></i>
                    </div>
                </div>
                <h3 class="text-lg md:text-2xl font-bold mb-2">${formatCurrency(stats.totalCommission)}</h3>
                <p class="text-text-light text-sm">Komisi (${stats.commissionRate}%)</p>
            </div>
        </div>
    `;
    
    document.getElementById('sales-stats').innerHTML = statsHTML;
    
    // Render orders
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
            'pending': 'bg-yellow-100 text-yellow-700',
            'dikirim': 'bg-blue-100 text-blue-700',
            'selesai': 'bg-green-100 text-green-700'
        };
        
        ordersList.innerHTML = stats.orders.map(order => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 hover:border-primary transition-colors">
                <div class="flex flex-col md:flex-row justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="font-mono text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">${order.id}</span>
                        </div>
                        <p class="font-semibold">${order.customerName}</p>
                        <p class="text-sm text-text-light">${order.productName || 'Website Custom'}</p>
                        <p class="text-xs text-text-light mt-1">${formatDate(order.createdAt)}</p>
                    </div>
                    <div class="flex flex-col items-end justify-between gap-2">
                        <div class="text-right">
                            <div class="text-sm text-text-light">Revenue</div>
                            <div class="font-semibold text-lg">${formatCurrency(order.amount)}</div>
                            <div class="text-sm text-green-600">Komisi: ${formatCurrency(order.amount * (stats.commissionRate / 100))}</div>
                        </div>
                        <span class="px-3 py-1 rounded-lg text-sm font-medium ${statusColors[order.status] || statusColors.pending}">
                            ${order.status || 'pending'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
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
window.initSalesDashboard = initSalesDashboard;
window.applySalesFilter = applySalesFilter;
window.clearSalesFilter = clearSalesFilter;
window.copyToClipboard = copyToClipboard;
