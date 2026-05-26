import mysql.connector
from mysql.connector import pooling, Error
from contextlib import contextmanager

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "12345",
    "database": "patient360",
    "autocommit": False,
    "connection_timeout": 30,
    "raise_on_warnings": False,
}

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,
        pool_reset_session=True,
        **db_config
    )
except Error as e:
    raise Exception(f"Failed to create connection pool: {e}")

@contextmanager
def get_cursor():
    conn = None
    cursor = None
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        yield cursor
        conn.commit()
    except Error as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

class MySQLConnection:
    @staticmethod
    def get_connection():
        try:
            return connection_pool.get_connection()
        except Error as e:
            raise Exception(f"Failed to get database connection: {e}")

    @staticmethod
    def is_connected(conn):
        try:
            return conn.is_connected()
        except:
            return False

mysql_conn = MySQLConnection()