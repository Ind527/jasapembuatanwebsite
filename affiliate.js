// Affiliate System - Frontend Only with localStorage
class AffiliateSystem {
    constructor() {
        this.storageKey = 'affiliateData';
        this.clicksKey = 'affiliateClicks';
        this.ordersKey = 'affiliateOrders';
        this.init();
    }

    init() {
        // Initialize affiliate data if not exists
        if (!localStorage.getItem(this.storageKey)) {
            this.createNewAffiliate();
        }
        
        // Initialize clicks tracking
        if (!localStorage.getItem(this.clicksKey)) {
            localStorage.setItem(this.clicksKey, JSON.stringify([]));
        }
        
        // Initialize orders tracking
        if (!localStorage.getItem(this.ordersKey)) {
            localStorage.setItem(this.ordersKey, JSON.stringify([]));
        }
        
        // Check if current page has referral parameter
        this.trackReferral();
    }

    createNewAffiliate() {
        const affiliateCode = this.generateAffiliateCode();
        const affiliateData = {
            code: affiliateCode,
            created: new Date().toISOString(),
            name: 'User Affiliate',
            email: ''
        };
        localStorage.setItem(this.storageKey, JSON.stringify(affiliateData));
        return affiliateData;
    }

    generateAffiliateCode() {
        const prefix = 'AFF';
        const random = Math.floor(1000 + Math.random() * 9000);
        return prefix + random;
    }

    getAffiliateData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    updateAffiliateInfo(name, email) {
        const data = this.getAffiliateData();
        if (data) {
            data.name = name || data.name;
            data.email = email || data.email;
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        }
        return false;
    }

    getReferralLink() {
        const data = this.getAffiliateData();
        if (!data) return '';
        
        const baseUrl = window.location.origin;
        return `${baseUrl}/?ref=${data.code}`;
    }

    trackReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode) {
            this.recordClick(refCode);
            // Store ref code in sessionStorage for later use (e.g., when placing order)
            sessionStorage.setItem('affiliateRef', refCode);
        }
    }

    recordClick(refCode) {
        const clicks = JSON.parse(localStorage.getItem(this.clicksKey) || '[]');
        clicks.push({
            refCode: refCode,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        localStorage.setItem(this.clicksKey, JSON.stringify(clicks));
    }

    getClickStats() {
        const data = this.getAffiliateData();
        if (!data) return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
        
        const clicks = JSON.parse(localStorage.getItem(this.clicksKey) || '[]');
        const myClicks = clicks.filter(c => c.refCode === data.code);
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: myClicks.length,
            today: myClicks.filter(c => new Date(c.timestamp) >= today).length,
            thisWeek: myClicks.filter(c => new Date(c.timestamp) >= weekAgo).length,
            thisMonth: myClicks.filter(c => new Date(c.timestamp) >= monthAgo).length
        };
    }

    recordOrder(orderNumber, amount) {
        const data = this.getAffiliateData();
        if (!data) return false;
        
        const orders = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
        orders.push({
            refCode: data.code,
            orderNumber: orderNumber,
            amount: amount,
            commission: amount * 0.1, // 10% commission
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
        return true;
    }

    getOrderStats() {
        const data = this.getAffiliateData();
        if (!data) return { total: 0, totalRevenue: 0, totalCommission: 0, orders: [] };
        
        const orders = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
        const myOrders = orders.filter(o => o.refCode === data.code);
        
        return {
            total: myOrders.length,
            totalRevenue: myOrders.reduce((sum, o) => sum + o.amount, 0),
            totalCommission: myOrders.reduce((sum, o) => sum + o.commission, 0),
            orders: myOrders
        };
    }

    // Generate demo data for demonstration
    generateDemoData() {
        const data = this.getAffiliateData();
        if (!data) return;
        
        // Clear existing data
        localStorage.setItem(this.clicksKey, JSON.stringify([]));
        localStorage.setItem(this.ordersKey, JSON.stringify([]));
        
        // Generate demo clicks (last 30 days)
        const clicks = [];
        for (let i = 0; i < 45; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            clicks.push({
                refCode: data.code,
                timestamp: date.toISOString(),
                page: '/'
            });
        }
        localStorage.setItem(this.clicksKey, JSON.stringify(clicks));
        
        // Generate demo orders
        const orders = [];
        const orderAmounts = [2500000, 3500000, 5000000, 4200000, 6800000];
        for (let i = 0; i < 5; i++) {
            const daysAgo = Math.floor(Math.random() * 25);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            orders.push({
                refCode: data.code,
                orderNumber: `ORD${String(i + 1).padStart(5, '0')}`,
                amount: orderAmounts[i],
                commission: orderAmounts[i] * 0.1,
                timestamp: date.toISOString()
            });
        }
        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    }

    resetAffiliate() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.clicksKey);
        localStorage.removeItem(this.ordersKey);
        this.createNewAffiliate();
    }
}

// Initialize affiliate system
const affiliateSystem = new AffiliateSystem();
