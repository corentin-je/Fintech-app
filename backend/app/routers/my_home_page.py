from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/home", tags=["home"]) 


class ProcessRequest(BaseModel):
    input: str


class ProcessResponse(BaseModel):
    received: str
    processed: str


@router.post("/process", response_model=ProcessResponse)
async def process(payload: ProcessRequest) -> ProcessResponse:
    text = payload.input
    processed = text.upper()
    return ProcessResponse(received=text, processed=processed)
