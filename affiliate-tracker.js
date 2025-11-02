// Affiliate Link Tracker
// Handles ?ref=AFF1234 parameter tracking and order recording

(function() {
    // Check for ref parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
        // Store affiliate code in sessionStorage
        sessionStorage.setItem('affiliateRef', refCode);
        
        // Record click
        if (typeof DashboardSystem !== 'undefined') {
            DashboardSystem.recordClick(refCode);
        } else {
            // Fallback if DashboardSystem not loaded yet
            const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
            clicks.push({
                code: refCode,
                timestamp: new Date().toISOString(),
                id: 'click_' + Date.now()
            });
            localStorage.setItem('affiliateClicks', JSON.stringify(clicks));
        }
        
        console.log('Affiliate tracking activated:', refCode);
        
        // Show affiliate banner
        showAffiliateBanner(refCode);
    }
    
    // Function to show affiliate banner
    function showAffiliateBanner(code) {
        // Check if we're not on the affiliate dashboard page
        if (window.location.pathname.includes('affiliate.html')) return;
        
        const banner = document.createElement('div');
        banner.className = 'fixed top-16 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 shadow-lg z-40 animate-slide-down';
        banner.innerHTML = `
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i class="fas fa-gift text-2xl"></i>
                    <div>
                        <p class="font-semibold">Anda mengunjungi dengan link referral!</p>
                        <p class="text-sm opacity-90">Kode: ${code} - Lanjutkan pemesanan untuk mendukung referrer Anda</p>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (banner.parentElement) {
                banner.remove();
            }
        }, 10000);
    }
    
    // Get current affiliate code
    window.getAffiliateRef = function() {
        return sessionStorage.getItem('affiliateRef');
    };
    
    // Create order from contact form
    window.createAffiliateOrder = function(formData) {
        const affiliateCode = getAffiliateRef();
        
        if (!affiliateCode) {
            console.log('No affiliate ref found');
            return null;
        }
        
        const orderData = {
            affiliateCode: affiliateCode,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone || '',
            productName: formData.service || 'Website Custom',
            message: formData.message || '',
            amount: estimateOrderAmount(formData.service),
        };
        
        // Create order
        if (typeof DashboardSystem !== 'undefined') {
            const order = DashboardSystem.createOrder(orderData);
            console.log('Order created:', order);
            return order;
        } else {
            // Fallback
            const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
            const newOrder = {
                id: 'order_' + Date.now(),
                ...orderData,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };
            orders.push(newOrder);
            localStorage.setItem('affiliateOrders', JSON.stringify(orders));
            console.log('Order created (fallback):', newOrder);
            return newOrder;
        }
    };
    
    // Estimate order amount based on service
    function estimateOrderAmount(service) {
        const priceMap = {
            'Landing Page': 1500000,
            'Company Profile': 3000000,
            'E-Commerce': 5000000,
            'Custom Application': 8000000,
            'Website Sekolah': 2000000,
            'Website Restoran': 2500000,
            'Website Klinik': 4000000,
            'Sistem CRM': 6000000
        };
        
        return priceMap[service] || 3000000; // Default 3 juta
    }
})();
