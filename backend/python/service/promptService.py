from sqlalchemy.orm import Session
from app.models.prompt import Prompt, PromptVersion
from app.schemas.prompt import PromptCreate, PromptUpdate, PromptVersionCreate
from datetime import datetime
import uuid

def create_prompt(db: Session, prompt: PromptCreate, user_id: str) -> Prompt:
    prompt_id = str(uuid.uuid4())
    version_id = str(uuid.uuid4())
    
    db_prompt = Prompt(
        prompt_id=prompt_id,
        app_id=prompt.app_id,
        app_name=prompt.app_name,
        owner_id=user_id,
        editors=[user_id],  # Initially, only the owner is an editor
        is_public=prompt.is_public,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        delete_flag=False
    )
    
    # Create initial version
    db_version = PromptVersion(
        version_id=version_id,
        prompt_id=prompt_id,
        content=prompt.content,
        created_at=datetime.utcnow(),
        created_by=user_id,
        context=prompt.context,
        test_data=prompt.test_data
    )
    
    db.add(db_prompt)
    db.add(db_version)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

def get_prompt(db: Session, prompt_id: str) -> Prompt:
    return db.query(Prompt).filter(
        Prompt.prompt_id == prompt_id,
        Prompt.delete_flag == False
    ).first()

def get_user_prompts(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(Prompt).filter(
        Prompt.owner_id == user_id,
        Prompt.delete_flag == False
    ).offset(skip).limit(limit).all()

def get_public_prompts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Prompt).filter(
        Prompt.is_public == True,
        Prompt.delete_flag == False
    ).offset(skip).limit(limit).all()

def update_prompt(db: Session, prompt_id: str, prompt: PromptUpdate, user_id: str) -> Prompt:
    db_prompt = db.query(Prompt).filter(
        Prompt.prompt_id == prompt_id,
        Prompt.delete_flag == False
    ).first()
    
    if db_prompt and user_id in db_prompt.editors:
        update_data = prompt.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_prompt, key, value)
        db_prompt.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_prompt)
    return db_prompt

def create_prompt_version(
    db: Session,
    prompt_id: str,
    version: PromptVersionCreate,
    user_id: str
) -> PromptVersion:
    db_version = PromptVersion(
        version_id=str(uuid.uuid4()),
        prompt_id=prompt_id,
        content=version.content,
        created_at=datetime.utcnow(),
        created_by=user_id,
        context=version.context,
        test_data=version.test_data
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version

def delete_prompt(db: Session, prompt_id: str, user_id: str) -> bool:
    db_prompt = db.query(Prompt).filter(
        Prompt.prompt_id == prompt_id,
        Prompt.delete_flag == False
    ).first()
    
    if db_prompt and user_id in db_prompt.editors:
        db_prompt.delete_flag = True
        db_prompt.updated_at = datetime.utcnow()
        db.commit()
        return True
    return False
