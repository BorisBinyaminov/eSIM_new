from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from buy_esim import my_esim

router = APIRouter()

@router.get("/my-esims")
async def get_my_esims(request: Request):
    print("✅ esim_routes 1")
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        return JSONResponse(status_code=400, content={"success": False, "error": "Missing user ID"})

    try:
        result = await my_esim(user_id)
        print("✅ esim_routes 2")
        return JSONResponse(status_code=200, content={"success": True, "data": result})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
