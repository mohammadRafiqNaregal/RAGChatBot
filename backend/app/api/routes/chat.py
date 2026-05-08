from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def chat_ping() -> dict[str, str]:
    return {"service": "chat", "status": "ok"}
