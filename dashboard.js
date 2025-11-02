// Enhanced Dashboard System with Admin & Sales Features
// Stores data using Clerk user metadata (simulated with localStorage for frontend-only approach)

const DashboardSystem = {
    // Initialize user affiliate code on first login
    initializeUser(userEmail) {
        const userId = this.getUserId(userEmail);
        let userData = this.getUserData(userId);
        
        if (!userData) {
            // Generate new affiliate code for new user
            const affCode = this.generateAffiliateCode();
            userData = {
                id: userId,
                email: userEmail,
                affiliateCode: affCode,
                name: userEmail.split('@')[0],
                joinedDate: new Date().toISOString(),
                active: true,
                commissionRate: 10 // Default 10%
            };
            this.saveUserData(userId, userData);
            console.log('New user initialized:', userEmail, 'with code:', affCode);
        } else {
            console.log('Existing user loaded:', userEmail, 'with code:', userData.affiliateCode);
        }
        
        return userData;
    },
    
    // Generate unique affiliate code
    generateAffiliateCode() {
        const existing = this.getAllUsers().map(u => u.affiliateCode);
        let code;
        do {
            code = 'AFF' + Math.floor(1000 + Math.random() * 9000);
        } while (existing.includes(code));
        return code;
    },
    
    // Get user ID from email
    getUserId(email) {
        return 'user_' + btoa(email).replace(/=/g, '');
    },
    
    // Get user data
    getUserData(userId) {
        const allUsers = JSON.parse(localStorage.getItem('dashboardUsers') || '{}');
        return allUsers[userId] || null;
    },
    
    // Save user data
    saveUserData(userId, userData) {
        const allUsers = JSON.parse(localStorage.getItem('dashboardUsers') || '{}');
        allUsers[userId] = userData;
        localStorage.setItem('dashboardUsers', JSON.stringify(allUsers));
    },
    
    // Get all users (for admin)
    getAllUsers() {
        const allUsers = JSON.parse(localStorage.getItem('dashboardUsers') || '{}');
        return Object.values(allUsers);
    },
    
    // Update commission rate
    updateCommissionRate(userId, newRate) {
        const userData = this.getUserData(userId);
        if (userData) {
            userData.commissionRate = newRate;
            this.saveUserData(userId, userData);
        }
    },
    
    // Record affiliate click
    recordClick(affiliateCode) {
        const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
        clicks.push({
            code: affiliateCode,
            timestamp: new Date().toISOString(),
            id: 'click_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        });
        localStorage.setItem('affiliateClicks', JSON.stringify(clicks));
        console.log('Click recorded for:', affiliateCode);
    },
    
    // Get clicks for affiliate
    getClicksForAffiliate(affiliateCode, startDate = null, endDate = null) {
        const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
        let filtered = clicks.filter(c => c.code === affiliateCode);
        
        if (startDate) {
            filtered = filtered.filter(c => new Date(c.timestamp) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(c => new Date(c.timestamp) <= new Date(endDate));
        }
        
        return filtered;
    },
    
    // Create new order
    createOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
        const newOrder = {
            id: 'order_' + Date.now(),
            ...orderData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        orders.push(newOrder);
        localStorage.setItem('affiliateOrders', JSON.stringify(orders));
        return newOrder;
    },
    
    // Get orders for affiliate
    getOrdersForAffiliate(affiliateCode, startDate = null, endDate = null) {
        const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
        let filtered = orders.filter(o => o.affiliateCode === affiliateCode);
        
        if (startDate) {
            filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(endDate));
        }
        
        return filtered;
    },
    
    // Get all orders (for admin)
    getAllOrders(startDate = null, endDate = null) {
        const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
        let filtered = orders;
        
        if (startDate) {
            filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(endDate));
        }
        
        return filtered;
    },
    
    // Update order status
    updateOrderStatus(orderId, newStatus) {
        const orders = JSON.parse(localStorage.getItem('affiliateOrders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            order.updatedAt = new Date().toISOString();
            localStorage.setItem('affiliateOrders', JSON.stringify(orders));
        }
    },
    
    // Calculate statistics for affiliate
    getAffiliateStats(affiliateCode, startDate = null, endDate = null) {
        const clicks = this.getClicksForAffiliate(affiliateCode, startDate, endDate);
        const orders = this.getOrdersForAffiliate(affiliateCode, startDate, endDate);
        const userId = this.getUserByAffiliateCode(affiliateCode);
        const userData = userId ? this.getUserData(userId) : null;
        const commissionRate = userData ? userData.commissionRate : 10;
        
        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const totalCommission = totalRevenue * (commissionRate / 100);
        
        return {
            totalClicks: clicks.length,
            totalOrders: orders.length,
            totalRevenue,
            totalCommission,
            commissionRate,
            orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        };
    },
    
    // Calculate admin statistics
    getAdminStats(startDate = null, endDate = null) {
        const users = this.getAllUsers().filter(u => u.active);
        const orders = this.getAllOrders(startDate, endDate);
        const allClicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
        
        let filteredClicks = allClicks;
        if (startDate) {
            filteredClicks = filteredClicks.filter(c => new Date(c.timestamp) >= new Date(startDate));
        }
        if (endDate) {
            filteredClicks = filteredClicks.filter(c => new Date(c.timestamp) <= new Date(endDate));
        }
        
        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const totalCommission = orders.reduce((sum, o) => {
            const user = this.getUserByAffiliateCode(o.affiliateCode);
            const userData = user ? this.getUserData(user) : null;
            const rate = userData ? userData.commissionRate : 10;
            return sum + ((o.amount || 0) * (rate / 100));
        }, 0);
        
        return {
            totalSales: users.length,
            totalClicks: filteredClicks.length,
            totalOrders: orders.length,
            totalRevenue,
            totalCommission,
            uniqueBuyers: new Set(orders.map(o => o.customerEmail)).size
        };
    },
    
    // Get user by affiliate code
    getUserByAffiliateCode(code) {
        const allUsers = JSON.parse(localStorage.getItem('dashboardUsers') || '{}');
        for (const [userId, userData] of Object.entries(allUsers)) {
            if (userData.affiliateCode === code) {
                return userId;
            }
        }
        return null;
    }
};

// Export for use in other scripts
window.DashboardSystem = DashboardSystem;
