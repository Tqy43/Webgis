document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const msgDiv = document.getElementById('registerMsg');
    const API_URL = 'http://localhost:5000/api/register';

    // 先检查服务器是否可用
    async function checkServerAvailability() {
        try {
            const response = await fetch('http://localhost:5000/api/health', {
                method: 'GET',
                cache: 'no-cache'
            });
            if (response.ok) {
                console.log('服务器连接正常');
                return true;
            } else {
                console.log('服务器响应异常:', response.status);
                return false;
            }
        } catch (error) {
            console.error('服务器连接失败:', error);
            return false;
        }
    }

    // 页面加载时检查服务器
    checkServerAvailability().then(available => {
        if (!available) {
            msgDiv.style.color = '#e74c3c';
            msgDiv.textContent = '警告: 无法连接到服务器，注册功能可能不可用';
        }
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // 重置消息
        msgDiv.textContent = '';
        msgDiv.style.color = '#e74c3c';
        
        // 表单验证
        if (!username) {
            msgDiv.textContent = '请输入用户名';
            return;
        }
        
        // 密码验证
        if (!validatePassword(password)) {
            msgDiv.textContent = '密码格式不正确：8-15位，必须包含大小写字母和数字';
            return;
        }
        
        // 确认密码
        if (password !== confirmPassword) {
            msgDiv.textContent = '两次输入的密码不一致';
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
        msgDiv.textContent = '正在注册...';
        
        console.log('发送注册请求:', JSON.stringify(userData));
        
        try {
        // 发送注册请求
            const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
            });
            
            console.log('注册响应状态:', response.status);
            const data = await response.json();
            console.log('注册响应数据:', data);
            
            if (data.success) {
                msgDiv.style.color = '#27ae60';
                msgDiv.textContent = '注册成功！正在跳转到登录页面...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                msgDiv.style.color = '#e74c3c';
                msgDiv.textContent = data.message || '注册失败，请稍后再试';
            }
        } catch (error) {
            console.error('注册请求错误:', error);
            msgDiv.style.color = '#e74c3c';
            msgDiv.textContent = '注册请求失败，请检查网络连接和服务器状态';
        }
    });
    
    // 密码验证函数
    function validatePassword(password) {
        // 8-15位，包含大小写字母和数字
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
        return regex.test(password);
    }
}); 