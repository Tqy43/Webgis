document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const msgDiv = document.getElementById('loginMsg');
    const API_URL = 'http://localhost:5000/api/login';

    // 检查服务器是否可用
    async function checkServerAvailability() {
        try {
            // 使用不需要认证的健康检查端点
            const response = await fetch('http://localhost:5000/api/health', {
                method: 'GET',
                cache: 'no-cache'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // 重置消息
        msgDiv.textContent = '';
        msgDiv.style.color = '#e74c3c';
        
        // 基本表单验证
        if (!username || !password) {
            msgDiv.textContent = '请输入用户名和密码';
            return;
        }

        // 先检查服务器是否可用
        const isServerAvailable = await checkServerAvailability();
        if (!isServerAvailable) {
            msgDiv.textContent = '服务器连接失败！请确保后端服务已启动（localhost:5000）';
            return;
        }
        
        // 构建请求数据
        const userData = {
            username: username,
            password: password
        };
        
        // 显示加载消息
        msgDiv.style.color = '#3498db';
        msgDiv.textContent = '正在登录...';
        
        console.log('正在发送登录请求:', userData);
        
        // 发送登录请求
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            console.log('登录响应状态:', response.status);
            const data = await response.json();
            console.log('登录响应数据:', data);
            
            if (data.success) {
                msgDiv.style.color = '#27ae60';
                msgDiv.textContent = '登录成功！正在跳转...';
                
                // 保存认证信息到本地存储
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('username', data.username); // 保存用户名
                    console.log('认证信息已保存到本地存储');
                }
                
                // 登录成功后跳转到主页
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                msgDiv.textContent = data.message || '登录失败，用户名或密码错误';
            }
        } catch (error) {
            console.error('登录失败:', error);
            msgDiv.textContent = '登录请求失败！请确保后端服务已启动（localhost:5000）';
        }
    });
}); 