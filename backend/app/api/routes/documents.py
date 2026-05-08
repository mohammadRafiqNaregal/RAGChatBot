from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def documents_ping() -> dict[str, str]:
    return {"service": "documents", "status": "ok"}
