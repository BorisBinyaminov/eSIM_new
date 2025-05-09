from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal, Order
from buy_esim import my_esim, cancel_esim, get_topup_packages, topup_esim

router = APIRouter()

@router.get("/my-esims")
async def get_my_esims(request: Request):
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        return JSONResponse(status_code=400, content={"success": False, "error": "Missing user ID"})

    try:
        result = await my_esim(user_id)
        return JSONResponse(status_code=200, content={"success": True, "data": result})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@router.post("/cancel")
async def cancel(request: Request):
    payload = await request.json()
    iccid = payload.get("iccid")
    tran_no = payload.get("tran_no")
    result = await cancel_esim(iccid=iccid, tran_no=tran_no)
    return JSONResponse(content=result)

@router.get("/topup-packages")
async def get_topups(iccid: str = Query(...)):
    try:
        packages = await get_topup_packages(iccid)
        return JSONResponse(content={"success": True, "packages": packages})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@router.post("/topup")
async def do_topup(request: Request):
    payload = await request.json()
    tran_no = payload.get("tran_no")
    package_code = payload.get("package_code")
    amount = payload.get("amount")
    try:
        result = await topup_esim(esim_tran_no=tran_no, package_code=package_code, amount=amount)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@router.post("/delete")
async def delete_esim(request: Request):
    payload = await request.json()
    iccid = payload.get("iccid")
    if not iccid:
        return JSONResponse(status_code=400, content={"success": False, "error": "Missing ICCID"})

    try:
        with SessionLocal() as session:
            order = session.query(Order).filter(Order.iccid == iccid).first()
            if not order:
                return JSONResponse(status_code=404, content={"success": False, "error": "eSIM not found in DB"})

            session.delete(order)
            session.commit()
            return JSONResponse(content={"success": True, "message": "eSIM deleted from database."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
