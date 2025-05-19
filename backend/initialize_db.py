"""
数据库初始化脚本
用于创建数据库结构和初始用户
"""
import os
import psycopg2
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 数据库连接参数
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "citywalk_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")

def initialize_database():
    """初始化数据库结构和数据"""
    connection = None
    try:
        print(f"连接到数据库: {DB_NAME}")
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()
        
        # 读取和执行schema.sql
        schema_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'schema.sql')
        print(f"执行数据库表结构文件: {schema_path}")
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
            cursor.execute(schema_sql)
        
        # 读取和执行init_data.sql
        init_data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'init_data.sql')
        print(f"执行初始数据文件: {init_data_path}")
        with open(init_data_path, 'r') as f:
            init_data_sql = f.read()
            cursor.execute(init_data_sql)
        
        connection.commit()
        print("数据库初始化完成")
        
        # 验证用户表和数据
        print("\n验证用户表:")
        cursor.execute("SELECT id, username, is_admin FROM users")
        users = cursor.fetchall()
        if users:
            print("用户列表:")
            for user in users:
                print(f"  - ID: {user[0]}, 用户名: {user[1]}, 管理员: {'是' if user[2] else '否'}")
        else:
            print("注意: 用户表为空，没有初始用户")
        
        return True
    except Exception as e:
        print(f"初始化数据库时出错: {e}")
        if connection:
            connection.rollback()
        return False
    finally:
        if connection:
            connection.close()
            print("数据库连接已关闭")

if __name__ == "__main__":
    print("开始初始化数据库...")
    if initialize_database():
        print("数据库初始化成功")
    else:
        print("数据库初始化失败") 