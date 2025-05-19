import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 数据库连接参数
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "citywalk_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")

# 创建连接池
try:
    connection_pool = psycopg2.pool.SimpleConnectionPool(
        1, 10,
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    print("数据库连接池创建成功")
except Exception as e:
    print(f"数据库连接池创建失败: {e}")
    connection_pool = None

def get_connection():
    """从连接池获取连接"""
    if connection_pool:
        return connection_pool.getconn()
    return None

def release_connection(connection):
    """释放连接回连接池"""
    if connection_pool:
        connection_pool.putconn(connection)

def execute_query(query, params=None, fetch=True):
    """执行SQL查询并返回结果"""
    connection = None
    cursor = None
    result = None
    
    try:
        connection = get_connection()
        if connection:
            cursor = connection.cursor()
            print(f"执行SQL: {query}, 参数: {params}")
            cursor.execute(query, params or ())
            
            if fetch:
                result = cursor.fetchall()
                print(f"查询结果: {result}")
            else:
                result = cursor.rowcount
                print(f"影响行数: {result}")
            
            # 确保任何更改都被明确提交
            connection.commit()
    except Exception as e:
        if connection:
            connection.rollback()
        print(f"执行查询失败: {e}")
        raise e
    finally:
        if cursor:
            cursor.close()
        if connection:
            release_connection(connection)
    
    return result

def insert_user(username, password_hash, is_admin=False):
    """插入新用户"""
    connection = None
    cursor = None
    try:
        print(f"正在插入用户: {username}, 是管理员: {is_admin}")
        connection = get_connection()
        if not connection:
            print("无法获取数据库连接")
            return None
            
        cursor = connection.cursor()
        query = """
        INSERT INTO users (username, password_hash, is_admin)
        VALUES (%s, %s, %s)
        RETURNING id;
        """
        print(f"执行SQL: {query}, 参数: ({username}, {password_hash}, {is_admin})")
        cursor.execute(query, (username, password_hash, is_admin))
        result = cursor.fetchall()
        print(f"查询结果: {result}")
        
        # 确保提交事务
        connection.commit()
        
        if result and len(result) > 0:
            user_id = result[0][0]
            print(f"用户插入成功, ID: {user_id}")
            return user_id
        else:
            print("用户插入失败: 没有返回ID")
            return None
    except Exception as e:
        if connection:
            connection.rollback()
        print(f"插入用户时发生错误: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            release_connection(connection)

def get_user_by_username(username):
    """通过用户名获取用户"""
    connection = None
    cursor = None
    try:
        connection = get_connection()
        if not connection:
            print("无法获取数据库连接")
            return None
            
        cursor = connection.cursor()
        query = """
        SELECT id, username, password_hash, is_admin
        FROM users
        WHERE username = %s;
        """
        print(f"执行SQL: {query}, 参数: ({username},)")
        cursor.execute(query, (username,))
        result = cursor.fetchall()
        print(f"查询结果: {result}")
        
        if result and len(result) > 0:
            user = {
                'id': result[0][0],
                'username': result[0][1],
                'password_hash': result[0][2],
                'is_admin': result[0][3]
            }
            return user
        return None
    except Exception as e:
        print(f"获取用户信息时发生错误: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            release_connection(connection)

def check_username_exists(username):
    """检查用户名是否已存在"""
    connection = None
    cursor = None
    try:
        connection = get_connection()
        if not connection:
            print("无法获取数据库连接")
            return True  # 默认返回True以防止创建重复用户
            
        cursor = connection.cursor()
        query = "SELECT 1 FROM users WHERE username = %s;"
        print(f"执行SQL: {query}, 参数: ({username},)")
        cursor.execute(query, (username,))
        result = cursor.fetchall()
        print(f"查询结果: {result}")
        
        exists = bool(result and len(result) > 0)
        if exists:
            print(f"用户名 '{username}' 已存在于数据库中")
        return exists
    except Exception as e:
        print(f"检查用户名是否存在时出错: {e}")
        # 默认返回True以防止创建重复用户
        return True
    finally:
        if cursor:
            cursor.close()
        if connection:
            release_connection(connection)

def initialize_db():
    """初始化数据库结构和基础数据"""
    connection = None
    try:
        connection = get_connection()
        if not connection:
            print("无法连接到数据库进行初始化")
            return False
        
        # 读取schema.sql文件
        schema_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'schema.sql')
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
        
        # 读取init_data.sql文件
        init_data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'init_data.sql')
        with open(init_data_path, 'r') as f:
            init_data_sql = f.read()
        
        cursor = connection.cursor()
        
        # 执行schema.sql中的创建表语句
        cursor.execute(schema_sql)
        
        # 执行init_data.sql中的数据初始化语句
        cursor.execute(init_data_sql)
        
        connection.commit()
        cursor.close()
        print("数据库初始化成功")
        return True
    except Exception as e:
        if connection:
            connection.rollback()
        print(f"数据库初始化失败: {e}")
        return False
    finally:
        if connection:
            release_connection(connection)

# 如果作为主模块运行，则初始化数据库
if __name__ == "__main__":
    initialize_db() 