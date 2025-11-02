// Clerk Authentication System for Affiliate Dashboard
// Frontend-only authentication with role-based access

let initialLoadComplete = false;

window.addEventListener('load', async function () {
    try {
        // Check if Clerk is available
        if (!window.Clerk) {
            console.error('Clerk SDK failed to load');
            showClerkError();
            return;
        }
        
        // Wait for Clerk to load
        await window.Clerk.load();
        
        // Add listener for reactive UI updates on auth state changes
        // Only trigger after initial load to prevent infinite loop
        window.Clerk.addListener(({ user }) => {
            if (!initialLoadComplete) {
                return; // Skip listener on initial load
            }
            
            if (user) {
                // User just signed in
                handleUserSignedIn();
            } else {
                // User just signed out
                handleUserSignedOut();
            }
        });
        
        const authDiv = document.getElementById('auth');
        const contentDiv = document.getElementById('affiliate-content');
        const userButtonDiv = document.getElementById('user-button');
        
        // Check if user is signed in
        if (window.Clerk.user) {
            // User is logged in
            console.log('User logged in:', window.Clerk.user.primaryEmailAddress.emailAddress);
            
            // Hide auth, show content
            if (authDiv) authDiv.style.display = 'none';
            if (contentDiv) contentDiv.style.display = 'block';
            
            // Mount user button for logout
            if (userButtonDiv) {
                window.Clerk.mountUserButton(userButtonDiv, {
                    afterSignOutUrl: window.location.href
                });
            }
            
            // Get user role based on email
            const userEmail = window.Clerk.user.primaryEmailAddress.emailAddress;
            const userRole = getUserRole(userEmail);
            
            // Apply role-based features
            if (userRole === 'admin') {
                initAdminDashboard(userEmail);
            } else if (userRole === 'sales') {
                initSalesDashboard(userEmail);
            } else {
                // Default user role
                initSalesDashboard(userEmail);
            }
            
        } else {
            // User is not logged in
            console.log('No user logged in, showing sign-in');
            
            // Show auth, hide content
            if (authDiv) authDiv.style.display = 'flex';
            if (contentDiv) contentDiv.style.display = 'none';
            
            // Mount sign-in component to dedicated container
            const signInContainer = document.getElementById('clerk-signin-container');
            if (signInContainer) {
                window.Clerk.mountSignIn(signInContainer, {
                appearance: {
                    variables: {
                        colorPrimary: '#0EA5E9',
                        colorText: '#111111',
                        fontFamily: 'Inter, sans-serif'
                    },
                    elements: {
                        formButtonPrimary: {
                            backgroundColor: '#111111',
                            '&:hover': {
                                backgroundColor: '#333333'
                            }
                        }
                    }
                }
                });
            }
        }
        
        // Mark initial load as complete to enable reactive listeners
        initialLoadComplete = true;
        
    } catch (error) {
        console.error('Clerk initialization error:', error);
    }
});

// Determine user role based on email
function getUserRole(email) {
    if (email === 'admin@situskita.site') {
        return 'admin';
    }
    // All other users are sales
    return 'sales';
}

// Initialize Admin Dashboard
function initAdminDashboard(userEmail) {
    console.log('🔹 Admin mode activated for:', userEmail);
    document.body.classList.add('admin-mode');
    
    // Show admin panel after header
    showAdminPanel();
    
    // Update header to show admin status
    const headerTitle = document.querySelector('main h1');
    if (headerTitle) {
        headerTitle.innerHTML = 'Dashboard <span class="text-gradient">Admin</span>';
    }
    
    const headerSubtitle = document.querySelector('main h1 + p');
    if (headerSubtitle) {
        headerSubtitle.textContent = 'Kelola seluruh affiliate sales dan statistik platform';
    }
}

// Initialize Sales Dashboard
function initSalesDashboard(userEmail) {
    console.log('🔹 Sales mode activated for:', userEmail);
    document.body.classList.add('sales-mode');
    
    // Link affiliate code to user email
    affiliateSystem.updateAffiliateInfo('Sales User', userEmail);
    
    // Display personal affiliate data
    displayAffiliateData();
}

// Show Admin Panel with Sales Management
function showAdminPanel() {
    const mainContent = document.querySelector('#affiliate-content > div');
    if (!mainContent) return;
    
    // Create admin panel
    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.className = 'mb-8';
    adminPanel.innerHTML = `
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg p-8 text-white mb-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-3xl font-jakarta font-bold mb-2">Panel Admin</h2>
                    <p class="text-sm opacity-90">Kelola sales team dan statistik affiliate</p>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <i class="fas fa-crown text-yellow-300 mr-2"></i>
                    <span class="font-semibold">Administrator</span>
                </div>
            </div>
        </div>
        
        <!-- Sales Management -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-jakarta font-bold">Manajemen Sales</h2>
                <button onclick="showAddSalesModal()" class="btn-primary px-6 py-3 rounded-lg font-medium">
                    <i class="fas fa-user-plus mr-2"></i> Tambah Sales
                </button>
            </div>
            <div id="sales-list" class="space-y-4">
                <!-- Sales list will be populated here -->
            </div>
        </div>
        
        <!-- All Statistics -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-jakarta font-bold mb-6">Statistik Keseluruhan</h2>
            <div class="grid md:grid-cols-4 gap-6">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div class="text-sm text-text-light mb-2">Total Sales</div>
                    <div class="text-3xl font-bold text-blue-600" id="admin-total-sales">0</div>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div class="text-sm text-text-light mb-2">Total Klik</div>
                    <div class="text-3xl font-bold text-purple-600" id="admin-total-clicks">0</div>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div class="text-sm text-text-light mb-2">Total Order</div>
                    <div class="text-3xl font-bold text-green-600" id="admin-total-orders">0</div>
                </div>
                <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                    <div class="text-sm text-text-light mb-2">Total Komisi</div>
                    <div class="text-2xl font-bold text-yellow-600" id="admin-total-commission">Rp 0</div>
                </div>
            </div>
        </div>
    `;
    
    // Insert admin panel at the beginning
    mainContent.insertBefore(adminPanel, mainContent.firstChild);
    
    // Load and display sales data
    loadSalesData();
    loadAdminStatistics();
}

// Load sales data from localStorage
function loadSalesData() {
    const salesList = getSalesList();
    displaySalesList(salesList);
}

// Get sales list from localStorage
function getSalesList() {
    const data = localStorage.getItem('salesTeam');
    if (!data) {
        // Create default sales list
        const defaultSales = [
            {
                id: 'sales1',
                name: 'Ahmad Fauzi',
                email: 'ahmad@situskita.site',
                code: 'AFF1001',
                active: true,
                joined: new Date().toISOString()
            },
            {
                id: 'sales2',
                name: 'Siti Nurhaliza',
                email: 'siti@situskita.site',
                code: 'AFF1002',
                active: true,
                joined: new Date().toISOString()
            }
        ];
        localStorage.setItem('salesTeam', JSON.stringify(defaultSales));
        return defaultSales;
    }
    return JSON.parse(data);
}

// Display sales list
function displaySalesList(salesList) {
    const container = document.getElementById('sales-list');
    if (!container) return;
    
    if (salesList.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-text-light">
                <i class="fas fa-users text-4xl mb-4 opacity-50"></i>
                <p>Belum ada sales terdaftar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = salesList.map(sales => `
        <div class="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                        ${sales.name.charAt(0)}
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">${sales.name}</h3>
                        <p class="text-sm text-text-light">${sales.email}</p>
                        <p class="text-sm text-primary font-mono mt-1">Kode: ${sales.code}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <div class="text-sm text-text-light">Status</div>
                        <div class="font-semibold ${sales.active ? 'text-green-600' : 'text-red-600'}">
                            ${sales.active ? 'Aktif' : 'Nonaktif'}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="toggleSalesStatus('${sales.id}')" 
                            class="px-4 py-2 rounded-lg ${sales.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors">
                            <i class="fas fa-${sales.active ? 'pause' : 'play'} mr-2"></i>${sales.active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button onclick="deleteSales('${sales.id}')" 
                            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                            <i class="fas fa-trash mr-2"></i>Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load admin statistics
function loadAdminStatistics() {
    const salesList = getSalesList();
    const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
    const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
    
    // Calculate totals
    const totalClicks = clicks.length;
    const totalOrders = orders.length;
    const totalCommission = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
    
    // Update admin stats
    document.getElementById('admin-total-sales').textContent = salesList.filter(s => s.active).length;
    document.getElementById('admin-total-clicks').textContent = totalClicks;
    document.getElementById('admin-total-orders').textContent = totalOrders;
    document.getElementById('admin-total-commission').textContent = formatCurrency(totalCommission);
}

// Show add sales modal
window.showAddSalesModal = function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-jakarta font-bold mb-6">Tambah Sales Baru</h2>
            <form onsubmit="addNewSales(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-text-light mb-2">Nama Sales</label>
                    <input type="text" id="new-sales-name" required 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-text-light mb-2">Email Sales</label>
                    <input type="email" id="new-sales-email" required 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 btn-primary px-6 py-3 rounded-lg font-medium">
                        <i class="fas fa-check mr-2"></i> Tambah
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" 
                        class="flex-1 bg-gray-200 text-text-dark px-6 py-3 rounded-lg font-medium hover:bg-gray-300">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
};

// Add new sales
window.addNewSales = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('new-sales-name').value;
    const email = document.getElementById('new-sales-email').value;
    
    const salesList = getSalesList();
    const newSales = {
        id: 'sales' + Date.now(),
        name: name,
        email: email,
        code: 'AFF' + Math.floor(1000 + Math.random() * 9000),
        active: true,
        joined: new Date().toISOString()
    };
    
    salesList.push(newSales);
    localStorage.setItem('salesTeam', JSON.stringify(salesList));
    
    loadSalesData();
    loadAdminStatistics();
    
    // Close modal
    document.querySelector('.fixed.inset-0').remove();
    
    showNotification(`Sales ${name} berhasil ditambahkan!`);
};

// Toggle sales status
window.toggleSalesStatus = function(salesId) {
    const salesList = getSalesList();
    const sales = salesList.find(s => s.id === salesId);
    
    if (sales) {
        sales.active = !sales.active;
        localStorage.setItem('salesTeam', JSON.stringify(salesList));
        loadSalesData();
        loadAdminStatistics();
        showNotification(`Status sales berhasil diubah!`);
    }
};

// Delete sales
window.deleteSales = function(salesId) {
    if (!confirm('Apakah Anda yakin ingin menghapus sales ini?')) return;
    
    let salesList = getSalesList();
    salesList = salesList.filter(s => s.id !== salesId);
    localStorage.setItem('salesTeam', JSON.stringify(salesList));
    
    loadSalesData();
    loadAdminStatistics();
    showNotification('Sales berhasil dihapus!');
};

// Helper function for currency formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Helper function for notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle user signed in (reactive UI update)
function handleUserSignedIn() {
    console.log('User signed in, refreshing UI...');
    window.location.reload();
}

// Handle user signed out (reactive UI update)
function handleUserSignedOut() {
    console.log('User signed out, refreshing UI...');
    window.location.reload();
}

// Show error fallback if Clerk fails to load
function showClerkError() {
    const authDiv = document.getElementById('auth');
    if (!authDiv) return;
    
    authDiv.style.display = 'flex';
    authDiv.innerHTML = `
        <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <div class="text-center">
                <div class="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                </div>
                <h2 class="text-2xl font-jakarta font-bold mb-4">Gagal Memuat Sistem Login</h2>
                <p class="text-text-light mb-6">
                    Sistem autentikasi gagal dimuat. Silakan refresh halaman atau coba lagi nanti.
                </p>
                <button onclick="window.location.reload()" 
                    class="btn-primary px-6 py-3 rounded-lg font-medium">
                    <i class="fas fa-redo mr-2"></i> Refresh Halaman
                </button>
            </div>
        </div>
    `;
}
