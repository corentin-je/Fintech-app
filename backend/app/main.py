from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.my_home_page import router as home_router
from app.routers.auth import router as auth_router
from app.routers.opportunites import router as opportunites_router

app = FastAPI(title="Fullstack Starter API")

# CORS for local dev (Vite default ports)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Routers
app.include_router(home_router)
app.include_router(auth_router)
app.include_router(opportunites_router)
