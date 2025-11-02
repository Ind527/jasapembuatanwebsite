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
    if (email === 'sultancisoka@gmail.com') {
        return 'admin';
    }
    // All other users are sales
    return 'sales';
}

// Note: Dashboard initialization functions are now in admin-dashboard.js and sales-dashboard.js

// Note: Admin panel functions removed - now handled in admin-dashboard.js

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
