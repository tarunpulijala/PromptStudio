import os
import sys
import logging
from pathlib import Path

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.db.init_db import init_db
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database():
    """
    Create the database if it doesn't exist.
    """
    try:
        # Create a connection to PostgreSQL server
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (settings.POSTGRES_DB,))
        exists = cur.fetchone()
        
        if not exists:
            # Create database
            cur.execute(f'CREATE DATABASE {settings.POSTGRES_DB}')
            logger.info(f"Database {settings.POSTGRES_DB} created successfully!")
        else:
            logger.info(f"Database {settings.POSTGRES_DB} already exists.")
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"Error creating database: {str(e)}")
        raise

if __name__ == "__main__":
    create_database()
    init_db()
