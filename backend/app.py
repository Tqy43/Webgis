from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from auth import login_user, register_user, verify_token
from db_connector import initialize_db
from functools import wraps

app = Flask(__name__)
CORS(app)  # 允许跨域请求

with app.app_context():
    # 应用启动时初始化数据库
    initialize_db()

def token_required(f):
    """装饰器：验证JWT令牌"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'success': False, 'message': '缺少认证令牌'}), 401
        
        current_user = verify_token(token)
        if not current_user:
            return jsonify({'success': False, 'message': '无效或过期的令牌'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    """用户注册API"""
    data = request.get_json()
    print(f"收到注册请求: {data}")
    
    if not data or 'username' not in data or 'password' not in data:
        print("注册请求缺少必要信息")
        return jsonify({'success': False, 'message': '缺少必要的注册信息'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    print(f"开始注册用户: {username}")
    
    # 调用注册函数
    result = register_user(username, password)
    
    if result['success']:
        print(f"用户注册成功: {username}, ID: {result.get('user_id')}")
        return jsonify(result), 201
    else:
        print(f"用户注册失败: {username}, 原因: {result.get('message')}")
        return jsonify(result), 400

@app.route('/api/login', methods=['POST'])
def login():
    """用户登录API"""
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'success': False, 'message': '缺少用户名或密码'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    # 调用登录函数
    result = login_user(username, password)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 401

@app.route('/api/user', methods=['GET'])
@token_required
def get_user_info(current_user):
    """获取当前用户信息API（需要认证）"""
    return jsonify({
        'success': True,
        'user_id': current_user['user_id'],
        'username': current_user['username'],
        'is_admin': current_user['is_admin']
    })

@app.route('/api/check-auth', methods=['GET'])
@token_required
def check_auth(current_user):
    """检查认证状态API"""
    return jsonify({
        'success': True,
        'message': '认证有效'
    })

@app.route('/api/health', methods=['GET', 'HEAD'])
def health_check():
    """健康检查API（不需要认证）"""
    return jsonify({
        'status': 'ok',
        'message': '服务器运行正常'
    })

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(host=host, port=port, debug=debug) 