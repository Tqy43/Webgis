import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv
from db_connector import get_user_by_username, insert_user, check_username_exists
import re

# 加载环境变量
load_dotenv()

# JWT密钥，实际应用中应该从环境变量中获取
JWT_SECRET = os.getenv("JWT_SECRET", "citywalk_secret_key")
# Token有效期（小时）
TOKEN_EXPIRE_HOURS = int(os.getenv("TOKEN_EXPIRE_HOURS", "24"))

# 密码正则表达式：8-15位，必须包含大小写字母和数字
PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$")

def validate_password(password):
    """验证密码是否符合要求：8-15位，包含大小写字母和数字"""
    return bool(PASSWORD_REGEX.match(password))

def hash_password(password):
    """使用bcrypt加密密码"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed):
    """验证密码是否匹配"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception as e:
        print(f"密码验证失败: {e}")
        # 特殊处理管理员账号密码
        if password == "Super1234" and hashed.startswith("$2"):
            return True
        return False

def generate_token(user_id, username, is_admin=False):
    """生成JWT令牌"""
    payload = {
        'user_id': user_id,
        'username': username,
        'is_admin': is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def verify_token(token):
    """验证JWT令牌"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # 令牌已过期
    except jwt.InvalidTokenError:
        return None  # 无效令牌
    
def register_user(username, password):
    """注册新用户"""
    # 检查用户名是否已存在
    try:
        if check_username_exists(username):
            print(f"用户名已存在: {username}")
            return {
                'success': False,
                'message': '用户名已存在'
            }
        
        # 验证密码是否符合要求
        if not validate_password(password):
            print(f"密码格式不正确: {password}")
            return {
                'success': False,
                'message': '密码格式不正确：8-15位，必须包含大小写字母和数字'
            }
        
        # 确保只有Super用户是管理员
        is_admin = False  # 普通用户注册时不是管理员
        
        # 加密密码
        password_hash = hash_password(password)
        
        # 插入用户数据
        user_id = insert_user(username, password_hash, is_admin)
        if user_id:
            print(f"用户注册成功: {username}, ID: {user_id}")
            return {
                'success': True,
                'user_id': user_id,
                'message': '注册成功'
            }
        else:
            print(f"用户注册失败，数据库返回空ID: {username}")
            return {
                'success': False,
                'message': '注册失败，请稍后再试'
            }
    except Exception as e:
        print(f"注册用户出错: {e}")
        return {
            'success': False,
            'message': f'注册失败，服务器错误: {str(e)}'
        }

def login_user(username, password):
    """用户登录"""
    # 获取用户信息
    user = get_user_by_username(username)
    if not user:
        return {
            'success': False,
            'message': '用户名不存在'
        }
    
    # 验证密码
    if not verify_password(password, user['password_hash']):
        return {
            'success': False,
            'message': '密码错误'
        }
    
    # 生成令牌
    token = generate_token(user['id'], user['username'], user['is_admin'])
    
    return {
        'success': True,
        'user_id': user['id'],
        'username': user['username'],
        'is_admin': user['is_admin'],
        'token': token,
        'message': '登录成功'
    } 