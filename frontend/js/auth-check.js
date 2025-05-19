document.addEventListener('DOMContentLoaded', function() {
    // 获取存储的token
    const token = localStorage.getItem('auth_token');
    const API_BASE_URL = 'http://localhost:5000';
    
    // 如果没有token，重定向到登录页面
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // 验证token有效性
    fetch(`${API_BASE_URL}/api/check-auth`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('认证失败');
        }
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            throw new Error('认证检查返回失败');
        }
        
        // 获取用户信息
        return fetch(`${API_BASE_URL}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    })
    .then(response => response.json())
    .then(userData => {
        if (userData.success) {
            // 显示用户名
            document.getElementById('username-display').textContent = userData.username;
        }
    })
    .catch(error => {
        console.error('认证错误:', error);
        // 清除无效token
        localStorage.removeItem('auth_token');
        // 重定向到登录页面
        window.location.href = 'login.html';
    });
    
    // 退出登录按钮点击事件
    document.getElementById('logout-btn').addEventListener('click', function() {
        // 清除token
        localStorage.removeItem('auth_token');
        // 重定向到登录页面
        window.location.href = 'login.html';
    });
}); 