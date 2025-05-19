# CityWalk南京版应用 - 开发者日记

## 项目历程
1. 基础架构搭建：HTML/CSS/JS前端 + Flask后端 + PostgreSQL数据库
2. 用户认证系统实现：注册、登录、会话管理
3. Leaflet地图集成与基础交互
4. 前后端连接与API实现
5. 数据库事务管理优化与连接池问题修复

## 技术难点解决记录

### 用户认证问题
1. bcrypt密码哈希不一致问题
   - 问题：不同版本bcrypt可能生成不同前缀的哈希值(`$2a$`, `$2b$`等)
   - 解决：改进验证函数，增加特殊处理逻辑，提高兼容性

2. 管理员账号权限
   - 确保只有Super用户为管理员，其他注册用户为普通用户
   - 修改register_user函数和数据库插入逻辑

3. 用户重复注册
   - 实现严格的用户名查重逻辑
   - 增加详细的错误日志和友好提示

### 数据库事务管理问题
1. 连接池事务不一致问题
   - 问题：用户注册成功后无法登录，数据库查询不到新插入的用户
   - 原因：连接池中不同连接之间的事务隔离，提交不一致
   - 解决：重构数据库操作函数，确保显式事务提交，使用相同的连接处理相关操作

2. 数据库操作错误处理
   - 增强了错误捕获和回滚机制
   - 添加了详细日志输出，方便排查问题

### 前端交互优化
1. 登录跳转问题
   - 问题：登录成功后无法跳转至主页
   - 原因：API端点路径不一致，相对路径错误
   - 解决：统一使用`http://localhost:5000`作为API基础URL

2. 注册表单优化
   - 添加更完善的表单验证
   - 增加用户友好的错误提示
   - 改进交互反馈

### 数据库连接问题排查指南
如果数据库连接失败，请检查：

1. PostgreSQL服务是否正在运行
   ```
   # Windows
   net start postgresql
   
   # Linux
   sudo service postgresql start
   ```

2. 数据库连接参数是否正确：
   - 在backend目录中创建.env文件（如果没有）
   - 文件内容应该包括：
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=citywalk_db
     DB_USER=postgres
     DB_PASS=postgres
     JWT_SECRET=your_secret_key_here
     TOKEN_EXPIRE_HOURS=24
     ```

3. 是否已创建citywalk_db数据库：
   ```
   psql -U postgres
   CREATE DATABASE citywalk_db;
   \q
   ```

4. 连接池问题排查：
   - 如果注册后无法登录，检查后端日志中的SQL执行结果
   - 可能需要重启应用服务器，确保连接池正确释放

### 常见问题解决方案

#### 管理员密码问题
如果管理员密码验证失败：
```
cd backend
python fix_admin_password.py
```

#### 注册失败问题
如果用户注册失败：
1. 检查密码是否符合要求：8-15位，包含大小写字母和数字
2. 检查用户名是否已存在
3. 检查浏览器控制台和后端日志

#### 登录失败问题
如果注册成功但无法登录：
1. 检查后端日志中的SQL查询结果
2. 可能是数据库事务未正确提交，重启应用服务器
3. 确认用户名输入正确（区分大小写）

## 计划中功能
1. 路线规划与保存
2. 用户评论与社区互动
3. 个人收藏与历史记录
4. 景点详情与门店信息

## Git仓库管理

### 建议的.gitignore内容
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# 虚拟环境
venv/
ENV/
citywalk/

# 敏感信息
.env
*.pem
*.key

# 数据库
*.sqlite3
*.db

# 日志
*.log

# IDE
.idea/
.vscode/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db
``` 