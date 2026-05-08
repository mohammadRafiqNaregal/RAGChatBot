from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def auth_ping() -> dict[str, str]:
    return {"service": "auth", "status": "ok"}
