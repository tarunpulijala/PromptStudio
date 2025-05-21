from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.crud import prompt as prompt_crud
from app.schemas.prompt import Prompt, PromptCreate, PromptUpdate, PromptVersion, PromptVersionCreate
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Prompt)
def create_prompt(
    prompt: PromptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new prompt with an initial version.
    """
    return prompt_crud.create_prompt(db=db, prompt=prompt, user_id=current_user.id)

@router.get("/", response_model=List[Prompt])
def read_prompts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all prompts owned by the current user.
    """
    prompts = prompt_crud.get_user_prompts(db, user_id=current_user.id, skip=skip, limit=limit)
    return prompts

@router.get("/public", response_model=List[Prompt])
def read_public_prompts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all public prompts.
    """
    prompts = prompt_crud.get_public_prompts(db, skip=skip, limit=limit)
    return prompts

@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(
    prompt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific prompt by ID.
    """
    prompt = prompt_crud.get_prompt(db, prompt_id=prompt_id)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if prompt.owner_id != current_user.id and not prompt.is_public:
        raise HTTPException(status_code=403, detail="Not authorized to access this prompt")
    return prompt

@router.put("/{prompt_id}", response_model=Prompt)
def update_prompt(
    prompt_id: str,
    prompt: PromptUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a prompt's metadata.
    """
    updated_prompt = prompt_crud.update_prompt(db, prompt_id=prompt_id, prompt=prompt, user_id=current_user.id)
    if updated_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return updated_prompt

@router.post("/{prompt_id}/versions", response_model=PromptVersion)
def create_version(
    prompt_id: str,
    version: PromptVersionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new version for a prompt.
    """
    prompt = prompt_crud.get_prompt(db, prompt_id=prompt_id)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if current_user.id not in prompt.editors:
        raise HTTPException(status_code=403, detail="Not authorized to create versions for this prompt")
    
    return prompt_crud.create_prompt_version(
        db=db,
        prompt_id=prompt_id,
        version=version,
        user_id=current_user.id
    )

@router.get("/{prompt_id}/versions", response_model=List[PromptVersion])
def read_versions(
    prompt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all versions of a prompt.
    """
    prompt = prompt_crud.get_prompt(db, prompt_id=prompt_id)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if prompt.owner_id != current_user.id and not prompt.is_public:
        raise HTTPException(status_code=403, detail="Not authorized to access this prompt's versions")
    
    return prompt.versions

@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(
    prompt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Soft delete a prompt.
    """
    if not prompt_crud.delete_prompt(db, prompt_id=prompt_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Prompt not found")
