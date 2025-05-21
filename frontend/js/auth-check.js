document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Add event listener for logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
});

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        // User is logged in
        document.getElementById('username-display').textContent = `欢迎, ${username}`;
        document.getElementById('logout-btn').style.display = 'inline-block';
        document.querySelector('.login-btn').style.display = 'none';
        document.querySelector('.register-btn').style.display = 'none';
        
        // Dispatch event for other components to respond to
        document.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { username: username }
        }));
    } else {
        // User is not logged in
        document.getElementById('username-display').textContent = '';
        document.getElementById('logout-btn').style.display = 'none';
        document.querySelector('.login-btn').style.display = 'inline-block';
        document.querySelector('.register-btn').style.display = 'inline-block';
        
        // Dispatch event for other components to respond to
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
}

// Function to handle logout
function logout() {
    // Clear authentication data
        localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    
    // Update UI
    checkAuthStatus();
    
    // Redirect to login page if needed
    // window.location.href = 'login.html';
    
    // For now, just stay on the page with updated UI
    alert('您已成功退出登录');
} 