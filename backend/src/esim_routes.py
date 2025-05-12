from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order
import json
import logging
from buy_esim import my_esim, cancel_esim, get_topup_packages, topup_esim, query_esim_by_iccid, update_usage_by_iccid, query_usage, process_purchase

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

@router.post("/refresh")
async def refresh_usage(request: Request):
    body = await request.json()
    iccid = body.get("iccid")
    if not iccid:
        return {"success": False, "error": "Missing ICCID"}

    try:
        with SessionLocal() as session:
            order = session.query(Order).filter(Order.iccid == iccid).first()
            if not order:
                return {"success": False, "error": "Order not found"}

            try:
                esim_list = json.loads(order.esim_list or "[]")
                tran_no = esim_list[0].get("esimTranNo") if esim_list else None
                if not tran_no:
                    return {"success": False, "error": "Missing esimTranNo"}
            except Exception as e:
                return {"success": False, "error": "Failed to parse esim_list"}

            # Check if it's 'In Use'
            api_data = await query_esim_by_iccid(iccid)
            smdp = api_data.get("smdpStatus", "")
            status = api_data.get("esimStatus", "")
            if smdp != "ENABLED" or status != "IN_USE":
                return {"success": False, "error": "Usage data only available for 'In Use' eSIMs"}

            usage = await query_usage(tran_no)
            if not usage:
                return {"success": False, "error": "Failed to fetch usage"}

            updated = update_usage_by_iccid(session, iccid, usage)
            return {"success": updated}

    except Exception as e:
        logging.exception("Refresh usage failed")
        return {"success": False, "error": "Unexpected error during refresh"}

@router.post("/buy")
async def buy_esim(request: Request):
    payload = await request.json()
    user_id = request.headers.get("X-User-ID")

    package_code = payload.get("package_code")
    order_price = payload.get("order_price")
    retail_price = payload.get("retail_price")
    count = payload.get("count", 1)
    period_num = payload.get("period_num")

    if not user_id or not package_code or not order_price or not retail_price:
        return JSONResponse(status_code=400, content={"success": False, "error": "Missing required parameters"})

    try:
        result = await process_purchase(
            package_code=package_code,
            user_id=user_id,
            order_price=order_price,
            retail_price=retail_price,
            count=count,
            period_num=period_num
        )
        return JSONResponse(status_code=200, content={"success": True, "data": result})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
