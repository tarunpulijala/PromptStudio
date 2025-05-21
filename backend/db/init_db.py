import os
import sys
from pathlib import Path

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent.parent)
if project_root not in sys.path:
    sys.path.append(project_root)

from app.core.config import settings
from app.models.prompt import Base, Prompt, PromptVersion
from app.models.user import User, Base as UserBase
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """
    Initialize the database by creating all tables.
    """
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        UserBase.metadata.create_all(bind=engine)
        
        logger.info("Database tables created successfully!")
        
        # Create a session to verify the connection
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Test the connection
        db.execute("SELECT 1")
        logger.info("Database connection verified successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    init_db()
