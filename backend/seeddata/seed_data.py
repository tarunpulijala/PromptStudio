from sqlalchemy.orm import Session
from app.models.prompt import Prompt, PromptVersion
from app.models.user import User
from datetime import datetime
import uuid
import json

def create_mock_users(db: Session):
    """Create mock users"""
    users = [
        User(
            id=str(uuid.uuid4()),
            email="john.doe@example.com",
            username="johndoe",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            is_active=True,
            created_at=datetime.utcnow()
        ),
        User(
            id=str(uuid.uuid4()),
            email="jane.smith@example.com",
            username="janesmith",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            is_active=True,
            created_at=datetime.utcnow()
        ),
        User(
            id=str(uuid.uuid4()),
            email="alex.wong@example.com",
            username="alexwong",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            is_active=True,
            created_at=datetime.utcnow()
        )
    ]
    
    for user in users:
        db.add(user)
    db.commit()
    return users

def create_mock_prompts(db: Session, users):
    """Create mock prompts with versions"""
    prompts = []
    
    # Sample prompt data
    prompt_data = [
        {
            "app_id": "chatgpt",
            "app_name": "ChatGPT",
            "content": "You are a helpful AI assistant. Please help me with the following task: {task}",
            "context": "General purpose assistant",
            "test_data": '{"task": "Write a poem about coding"}',
            "is_public": True,
            "owner": users[0].id,
            "editors": [users[0].id, users[1].id]
        },
        {
            "app_id": "dalle",
            "app_name": "DALL-E",
            "content": "Create an image of {subject} in the style of {style}",
            "context": "Image generation",
            "test_data": '{"subject": "a cat", "style": "watercolor"}',
            "is_public": True,
            "owner": users[0].id,
            "editors": [users[0].id]
        },
        {
            "app_id": "codeassist",
            "app_name": "Code Assistant",
            "content": "Help me debug this code:\n{code}",
            "context": "Code debugging",
            "test_data": '{"code": "def hello():\n    print(\'Hello, World!\')"}',
            "is_public": False,
            "owner": users[1].id,
            "editors": [users[1].id]
        },
        {
            "app_id": "gpt4",
            "app_name": "GPT-4",
            "content": "Analyze this text and provide insights:\n{text}",
            "context": "Text analysis",
            "test_data": '{"text": "The quick brown fox jumps over the lazy dog"}',
            "is_public": True,
            "owner": users[2].id,
            "editors": [users[2].id, users[0].id]
        },
        {
            "app_id": "claude",
            "app_name": "Claude",
            "content": "Summarize this article:\n{article}",
            "context": "Article summarization",
            "test_data": '{"article": "Sample article text..."}',
            "is_public": True,
            "owner": users[1].id,
            "editors": [users[1].id]
        },
        {
            "app_id": "midjourney",
            "app_name": "Midjourney",
            "content": "Generate an image with these specifications:\nStyle: {style}\nSubject: {subject}\nMood: {mood}",
            "context": "AI art generation",
            "test_data": '{"style": "cyberpunk", "subject": "cityscape", "mood": "futuristic"}',
            "is_public": True,
            "owner": users[0].id,
            "editors": [users[0].id, users[2].id]
        },
        {
            "app_id": "bard",
            "app_name": "Google Bard",
            "content": "Research and explain this topic: {topic}",
            "context": "Research assistant",
            "test_data": '{"topic": "quantum computing"}',
            "is_public": False,
            "owner": users[2].id,
            "editors": [users[2].id]
        },
        {
            "app_id": "copilot",
            "app_name": "GitHub Copilot",
            "content": "Generate code for this function:\n{description}",
            "context": "Code generation",
            "test_data": '{"description": "A function to sort a list of objects by date"}',
            "is_public": False,
            "owner": users[1].id,
            "editors": [users[1].id, users[0].id]
        },
        {
            "app_id": "stable-diffusion",
            "app_name": "Stable Diffusion",
            "content": "Create an image with these parameters:\nPrompt: {prompt}\nNegative prompt: {negative_prompt}\nSteps: {steps}",
            "context": "AI image generation",
            "test_data": '{"prompt": "a serene landscape", "negative_prompt": "ugly, blurry", "steps": "50"}',
            "is_public": True,
            "owner": users[0].id,
            "editors": [users[0].id, users[1].id, users[2].id]
        },
        {
            "app_id": "anthropic",
            "app_name": "Anthropic Claude",
            "content": "Analyze this dataset and provide insights:\n{data}",
            "context": "Data analysis",
            "test_data": '{"data": "sample dataset in JSON format"}',
            "is_public": False,
            "owner": users[2].id,
            "editors": [users[2].id]
        }
    ]
    
    for data in prompt_data:
        # Create prompt
        prompt = Prompt(
            prompt_id=str(uuid.uuid4()),
            app_id=data["app_id"],
            app_name=data["app_name"],
            owner_id=data["owner"],
            editors=data["editors"],
            is_public=data["is_public"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            delete_flag=False
        )
        db.add(prompt)
        db.flush()  # Flush to get the prompt_id
        
        # Create initial version
        version = PromptVersion(
            version_id=str(uuid.uuid4()),
            prompt_id=prompt.prompt_id,
            content=data["content"],
            created_at=datetime.utcnow(),
            created_by=data["owner"],
            context=data["context"],
            test_data=data["test_data"]
        )
        db.add(version)
        
        # Create a second version for some prompts
        if data["app_id"] in ["chatgpt", "dalle", "gpt4", "midjourney"]:
            version2 = PromptVersion(
                version_id=str(uuid.uuid4()),
                prompt_id=prompt.prompt_id,
                content=data["content"] + "\nAdditional instructions: Be creative and detailed.",
                created_at=datetime.utcnow(),
                created_by=data["editors"][-1],  # Last editor creates the new version
                context=data["context"],
                test_data=data["test_data"]
            )
            db.add(version2)
        
        prompts.append(prompt)
    
    db.commit()
    return prompts

def seed_database():
    """Main function to seed the database"""
    from app.database import SessionLocal
    
    db = SessionLocal()
    try:
        # Create users
        users = create_mock_users(db)
        print(f"Created {len(users)} users")
        
        # Create prompts with versions
        prompts = create_mock_prompts(db, users)
        print(f"Created {len(prompts)} prompts with versions")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
