# CityWalk南京版应用

## 项目简介
本项目为CityWalk南京版应用，旨在为用户提供南京城市漫步的路线推荐、景点分布、门店信息、社区互动及导航等功能。

## 技术栈
- 前端：HTML + CSS + 原生JavaScript
- 地图：Leaflet
- 后端：Python (Flask/Flask-RESTful)
- 数据库：PostgreSQL
- 数据传输：JSON

## 主要功能
1. 用户认证：注册、登录、权限管理
2. 地图交互：基于Leaflet的地图浏览
3. 路线推荐：南京城市特色路线展示
4. 用户社区：分享体验、评论互动（开发中）

## 安装与使用

### 环境准备
1. 安装 Python 3.8+ 和 pip
2. 安装 PostgreSQL 数据库
3. 确保 Node.js 和 npm 可用（用于前端开发工具）

### 快速启动
1. 克隆仓库
   ```
   git clone https://github.com/your-username/citywalk-nanjing.git
   cd citywalk-nanjing
   ```

2. 安装依赖
   ```
   pip install -r requirements.txt
   ```

3. 配置数据库
   - 创建.env文件在backend目录
   - 设置数据库参数（见开发者笔记）

4. 初始化数据库
   ```
   cd backend
   python db_connector.py
   ```

5. 启动服务器
   ```
   python app.py
   ```

6. 访问应用
   ```
   http://localhost:5000
   ```

### 账号说明
- 管理员账号：Super / Super1234
- 普通用户：可通过注册页面创建 