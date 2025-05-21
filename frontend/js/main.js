document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPages();
    
    // 初始化地图
    initMap();
    
    // 初始化功能菜单
    initSidebar();
    
    // 初始化导航面板
    initNavPanel();
    
    // 初始化用户中心选项卡
    initProfileTabs();
    
    // 初始化时检查登录状态
    checkLoginStatus();
});

// 初始化页面切换功能
function initPages() {
    // 获取所有页面链接
    const pageLinks = document.querySelectorAll('[data-page]');
    
    // 为每个链接添加点击事件
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });
    
    // 默认显示主页
    showPage('home');
}

// 切换显示页面
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page-container, .main-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // 移除所有活动状态
    document.querySelectorAll('.top-nav li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 显示选定的页面
    if (pageName === 'home') {
        document.getElementById('home-page').style.display = 'flex';
    } else {
        document.getElementById(pageName + '-page').style.display = 'block';
    }
    
    // 设置活动导航项
    document.querySelector(`.top-nav li a[data-page="${pageName}"]`).parentElement.classList.add('active');
}

// 初始化地图
function initMap() {
    // Initialize map centered on Nanjing
    const map = L.map('map').setView([32.0584, 118.7965], 13);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add a marker for Nanjing city center
    L.marker([32.0584, 118.7965])
        .addTo(map)
        .bindPopup('南京市中心')
        .openPopup();
    
    // 点击地图时关闭所有面板
    map.on('click', function() {
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.nav-panel').classList.remove('active');
    });
    
    // 注册feature点击事件
    registerFeatureClicks(map);
}

// 初始化侧边栏
function initSidebar() {
    const showMenuBtn = document.getElementById('show-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    
    // 显示菜单按钮点击事件
    showMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
    });
    
    // 关闭菜单按钮点击事件
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
}

// 初始化导航面板
function initNavPanel() {
    const showNavBtn = document.getElementById('show-nav-panel');
    const navPanel = document.querySelector('.nav-panel');
    const closeNavPanel = document.querySelector('.close-nav-panel');
    
    // 显示导航面板按钮点击事件
    showNavBtn.addEventListener('click', function() {
        navPanel.classList.add('active');
    });
    
    // 关闭导航面板按钮点击事件
    closeNavPanel.addEventListener('click', function() {
        navPanel.classList.remove('active');
    });
}

// 初始化用户中心选项卡功能
function initProfileTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活动状态
            tabItems.forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加活动状态
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(tabName + '-content').classList.add('active');
        });
    });
}

// 注册feature点击事件
function registerFeatureClicks(map) {
    const featureLinks = document.querySelectorAll('[data-feature]');
    
    featureLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 防止冒泡到地图点击事件
            
            const feature = this.getAttribute('data-feature');
            
            // 检查是否需要登录
            const isLoginRequired = this.closest('.login-required') !== null;
            const isLoggedIn = localStorage.getItem('auth_token') !== null;
            
            if (isLoginRequired && !isLoggedIn) {
                alert('请先登录以使用此功能');
                return;
            }
            
            handleFeatureClick(feature, map);
            
            // 在移动设备上点击功能后自动关闭侧边栏
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });
}

// Function to check login status on page load
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('auth_token') !== null;
    if (!isLoggedIn) {
        document.querySelector('.login-required').classList.add('locked');
    }
    
    // 注册登录状态事件监听
    document.addEventListener('userLoggedIn', function(e) {
        // Hide login/register buttons, show logout button
        document.querySelector('.login-btn').style.display = 'none';
        document.querySelector('.register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
        
        // 启用交互功能区域
        document.querySelector('.login-required').classList.remove('locked');
    });
    
    document.addEventListener('userLoggedOut', function(e) {
        // Show login/register buttons, hide logout button
        document.querySelector('.login-btn').style.display = 'inline-block';
        document.querySelector('.register-btn').style.display = 'inline-block';
        document.getElementById('logout-btn').style.display = 'none';
        
        // 禁用交互功能区域
        document.querySelector('.login-required').classList.add('locked');
    });
}

// Function to handle feature clicks
function handleFeatureClick(feature, map) {
    console.log(`Feature clicked: ${feature}`);
    
    // Sample points of interest in Nanjing
    const poiData = {
        'scenic-spots': [
            { name: '夫子庙', lat: 32.0225, lng: 118.7807, description: '南京著名景点，集旅游、美食和文化于一体' },
            { name: '中山陵', lat: 32.0581, lng: 118.8486, description: '孙中山先生的陵墓，是中国著名的旅游胜地' },
            { name: '南京总统府', lat: 32.0445, lng: 118.7985, description: '中国近代建筑的杰出代表' },
            { name: '玄武湖', lat: 32.0776, lng: 118.7993, description: '南京最大的城内公园和湖泊' },
            { name: '秦淮河', lat: 32.0258, lng: 118.7735, description: '南京的母亲河，历史文化名河' }
        ],
        'recommended-routes': [
            { name: '古都风情线', points: [[32.0225, 118.7807], [32.0445, 118.7985], [32.0581, 118.8486]] },
            { name: '生态休闲线', points: [[32.0776, 118.7993], [32.0486, 118.8203], [32.0258, 118.7735]] }
        ],
        'accommodation': [
            { name: '南京金陵饭店', lat: 32.0435, lng: 118.7778, description: '五星级酒店' },
            { name: '南京玄武饭店', lat: 32.0772, lng: 118.7972, description: '历史悠久的四星级酒店' }
        ]
    };
    
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    
    // Add base OSM layer back if needed
    if (map.getLayers && map.getLayers().length === 0) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }
    
    // Handle different features
    switch (feature) {
        case 'scenic-spots':
            poiData['scenic-spots'].forEach(spot => {
                L.marker([spot.lat, spot.lng])
                    .addTo(map)
                    .bindPopup(`<b>${spot.name}</b><br>${spot.description}`);
            });
            
            // Adjust view to see all markers
            map.setView([32.0500, 118.8000], 12);
            break;
            
        case 'recommended-routes':
            poiData['recommended-routes'].forEach((route, index) => {
                const colors = ['#FF5733', '#33A8FF'];
                L.polyline(route.points, {color: colors[index % colors.length], weight: 5})
                    .addTo(map)
                    .bindPopup(route.name);
                
                // Add markers at start and end points
                L.marker(route.points[0]).addTo(map).bindPopup(`${route.name} - 起点`);
                L.marker(route.points[route.points.length-1]).addTo(map).bindPopup(`${route.name} - 终点`);
            });
            
            map.setView([32.0500, 118.8000], 12);
            break;
            
        case 'accommodation':
            poiData['accommodation'].forEach(hotel => {
                L.marker([hotel.lat, hotel.lng])
                    .addTo(map)
                    .bindPopup(`<b>${hotel.name}</b><br>${hotel.description}`);
            });
            
            map.setView([32.0600, 118.7900], 13);
            break;
            
        case 'city-overview':
            // Display city boundary or general information
            map.setView([32.0584, 118.7965], 11);
            break;
            
        default:
            // Default view for other features
            map.setView([32.0584, 118.7965], 13);
    }
} 