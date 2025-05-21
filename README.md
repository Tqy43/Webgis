# CityWalk南京版应用

## 项目简介
CityWalk南京版是一个城市漫步导览应用，专为南京城市探索设计。该应用结合了地图导航、景点介绍、路线推荐等功能，帮助用户更好地探索南京城市风貌，发现城市之美。应用采用响应式设计，支持多种设备访问，让用户随时随地了解南京。

### 核心功能
- **交互式地图**：基于Leaflet的南京城市地图，支持缩放、标记等功能
- **景点分布**：展示南京市内主要景点位置及简介
- **推荐路线**：提供多条精心规划的城市漫步路线
- **出行攻略**：南京旅游和出行的实用信息
- **社区分享**：用户交流平台，分享游览体验和心得
- **自定义路线**：登录用户可自定义规划行程路线(开发中)
- **导航功能**：导航至目的地功能(开发中)

### 技术栈
- **前端**：HTML5 + CSS3 + 原生JavaScript
- **地图引擎**：Leaflet.js
- **后端**：Python (Flask) + RESTful API
- **数据库**：PostgreSQL
- **身份验证**：JWT (JSON Web Tokens)

## 项目文件组织

### 目录结构
```
CityWalk南京版/
│
├── frontend/                  # 前端资源目录
│   ├── assets/                # 静态资源
│   │   └── images/            # 图片资源
│   ├── css/                   # 样式文件
│   │   └── style.css          # 主样式表
│   ├── js/                    # JavaScript文件
│   │   ├── main.js            # 主脚本文件
│   │   ├── auth-check.js      # 身份验证脚本
│   │   ├── login.js           # 登录页脚本
│   │   └── register.js        # 注册页脚本
│   ├── index.html             # 主页面
│   ├── login.html             # 登录页面
│   └── register.html          # 注册页面
│
├── backend/                   # 后端资源目录
│   ├── app.py                 # 应用主入口
│   ├── auth.py                # 用户认证模块
│   ├── db_connector.py        # 数据库连接器
│   ├── initialize_db.py       # 数据库初始化
│   ├── requirements.txt       # 后端依赖
│   └── start_server.bat       # 服务启动脚本
│
├── db/                        # 数据库相关
│   ├── schema.sql             # 数据库结构
│   └── init_data.sql          # 初始数据
│
├── README.md                  # 项目说明文档(当前文档)
└── dev_notes.md               # 开发者笔记
```

### 核心文件介绍

#### 前端文件
- **index.html**：应用的主页面，包含地图显示、功能菜单及导航组件
- **style.css**：统一的样式定义，包含响应式布局
- **main.js**：主脚本文件，处理地图初始化、页面交互等功能
- **auth-check.js**：处理用户认证状态检查和界面调整

#### 后端文件
- **app.py**：Flask应用入口，提供API端点
- **auth.py**：用户认证逻辑，包括登录、注册、令牌验证
- **db_connector.py**：数据库连接和查询操作

#### 数据库文件
- **schema.sql**：数据库表结构定义
- **init_data.sql**：初始数据，包含示例用户和管理员账户

## 快速开始

### 后端启动
1. 进入backend目录
2. 运行 `start_server.bat` (Windows) 或 `python app.py` (所有平台)

### 前端访问
1. 打开浏览器访问 `frontend/index.html`
2. 或者设置简单的HTTP服务器（如Python的http.server）提供访问

### 账号说明
- **管理员账号**：Super / Super1234
- **普通用户**：可通过注册页面创建，或使用示例账号 Anna / Anna1234

## 项目截图（施工中）
![主页面](frontend/assets/images/screenshot-home.jpg)
![登录页面](frontend/assets/images/screenshot-login.jpg)

## 联系与支持
如有问题或建议，请联系项目维护团队。