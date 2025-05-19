window.onload = function() {
    // 初始化Leaflet地图
    var map = L.map('map').setView([32.060255, 118.796877], 12); // 南京市中心坐标
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    // 预留：后续可加载景点、路线等图层
}; 