from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import prompts
from app.core.config import settings

app = FastAPI(
    title="PromptHub API",
    description="API for managing prompts and their versions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    prompts.router,
    prefix="/api/prompts",
    tags=["prompts"]
)
