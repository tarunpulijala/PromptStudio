from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    prompt_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    app_id = Column(String(255), nullable=False)
    app_name = Column(String(255), nullable=False)
    owner_id = Column(String(255), ForeignKey("users.id"), nullable=False)
    editors = Column(JSON, default=list)  # Store as JSON array
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    delete_flag = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="prompts")
    versions = relationship("PromptVersion", back_populates="prompt", cascade="all, delete-orphan")

class PromptVersion(Base):
    __tablename__ = "prompt_versions"

    version_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    prompt_id = Column(String(36), ForeignKey("prompts.prompt_id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(255), nullable=False)
    context = Column(Text, default="")
    test_data = Column(Text, default="")

    prompt = relationship("Prompt", back_populates="versions")
