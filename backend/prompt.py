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
        editors=[user_id],
        is_public=prompt.is_public,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        delete_flag=False
    )
    
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

# ... (rest of the CRUD functions as shown in previous messages)
