from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from uuid import UUID

class PromptVersionBase(BaseModel):
    content: str
    context: Optional[str] = ""
    test_data: Optional[str] = ""

class PromptVersionCreate(PromptVersionBase):
    pass

class PromptVersion(PromptVersionBase):
    version_id: str
    prompt_id: str
    created_at: datetime
    created_by: str

    class Config:
        from_attributes = True

class PromptBase(BaseModel):
    app_id: str
    app_name: str
    is_public: bool = False

class PromptCreate(PromptBase):
    content: str
    context: Optional[str] = ""
    test_data: Optional[str] = ""

class PromptUpdate(BaseModel):
    app_id: Optional[str] = None
    app_name: Optional[str] = None
    is_public: Optional[bool] = None
    editors: Optional[List[str]] = None

class Prompt(PromptBase):
    prompt_id: str
    owner_id: str
    editors: List[str]
    created_at: datetime
    updated_at: datetime
    delete_flag: bool
    versions: List[PromptVersion]

    class Config:
        from_attributes = True
