import os
import sys
import requests
import json
import time
import threading
import traceback
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from auth import router as auth_router
from database import engine, Base  # Import engine and Base for DB initialization
import buy_esim
from support_bot import create_bot_app
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Load environment variables
load_dotenv()

# Force UTF-8 encoding (Windows Fix)
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

# Create FastAPI app
app = FastAPI()

# Bot status flag
bot_status = {"running": False}

# Include auth router for mini app authentication
app.include_router(auth_router)

# Create tables if they do not already exist
Base.metadata.create_all(bind=engine)
print("[DEBUG] All tables created (if not already present).")

# ✅ Serve images & JSON files from the `public/` directory
app.mount("/images", StaticFiles(directory="public/images"), name="images")
app.mount("/static", StaticFiles(directory="build/static"), name="static")

# ✅ Serve JSON files from `public/` with cache control
@app.get("/{filename}.json")
async def serve_json(filename: str):
    json_path = f"public/{filename}.json"
    if os.path.exists(json_path):
        response = FileResponse(json_path)
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
        return response
    return JSONResponse(content={"error": "File not found"}, status_code=404)

# ✅ Ensure `countries.json` exists
COUNTRIES_JSON_PATH = "public/countries.json"
if not os.path.exists(COUNTRIES_JSON_PATH):
    with open(COUNTRIES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump({}, f)

# ✅ Serve `index.html` for `/`
@app.get("/")
async def serve_index():
    return FileResponse("build/index.html")

@app.get("/bot/status")
async def get_bot_status():
    return {"bot_running": bot_status["running"]}

# ✅ Redirect all other routes to `index.html` (SPA support)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("build/index.html")

# ✅ Fetch eSIM Packages and Save to `public/`
ESIM_API_URL = "https://api.esimaccess.com/api/v1/open/package/list"
HEADERS = {
    "RT-AccessCode": os.getenv("REACT_APP_ESIM_API_Access_Code"),
    "RT-SecretKey": os.getenv("REACT_APP_ESIM_API_Secret_KEY"),
    "Content-Type": "application/json",
}

# Setup retry session
session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[502, 503, 504],
    allowed_methods=["POST"]
)
adapter = HTTPAdapter(max_retries=retries)
session.mount("https://", adapter)
session.mount("http://", adapter)

def adjust_prices(packages):
    for package in packages:
        if "retailPrice" in package and "price" in package:
            if package["retailPrice"] == 0:
                package["retailPrice"] = package["price"] * 3
            elif 0 < package["retailPrice"] <= package["price"]:
                package["retailPrice"] = package["price"] * 1.5
            elif package["retailPrice"] > package["price"] * 3:
                package["retailPrice"] = package["price"] * 3
    return packages

def fetch_packages():
    print("📡 Fetching package data...", flush=True)

    package_types = [
        ("allPackages.json", {"type": "BASE"}),
        ("regionalPackages.json", {"locationCode": "!RG", "type": "BASE"}),
        ("globalPackages.json", {"locationCode": "!GL", "type": "BASE"}),
    ]

    for filename, body in package_types:
        try:
            response = session.post(ESIM_API_URL, json=body, headers=HEADERS, timeout=10)
            response_data = response.json()

            if response_data.get("success"):
                packages = response_data["obj"]["packageList"]
                adjusted_packages = adjust_prices(packages)
                with open(f"public/{filename}", "w", encoding="utf-8") as f:
                    json.dump(adjusted_packages, f, indent=4)
                print(f"✅ Saved {filename} successfully in `public/` with updated prices!", flush=True)
            else:
                print(f"❌ Failed to fetch {filename}: {response_data.get('errorMsg')}", flush=True)
        except Exception as e:
            print(f"⚠️ Error fetching {filename}: {e}", flush=True)
            print(traceback.format_exc())

    try:
        with open("public/allPackages.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        country_packages = [
            package for package in data 
            if package.get("location") and len(package["location"]) == 2
        ]

        with open("public/countryPackages.json", "w", encoding="utf-8") as f:
            json.dump(country_packages, f, indent=4)

        print(f"✅ Filtered JSON saved successfully. Total country-specific packages: {len(country_packages)} out of {len(data)}", flush=True)
    except Exception as e:
        print(f"⚠️ Error filtering country-specific packages: {e}", flush=True)

    last_update_time = time.strftime("%Y-%m-%d %H:%M:%S")
    with open("public/lastUpdate.txt", "w", encoding="utf-8") as f:
        f.write(last_update_time)

    print(f"\n✅ Packages updated at: {last_update_time}", flush=True)

# ✅ Fetch packages immediately on startup
#fetch_packages()

# ✅ Periodic update of JSON files every 6 hours
def schedule_package_updates():
    while True:
        time.sleep(3600*6)
        fetch_packages()

def run_support_bot():
    print("🤖 Starting integrated Support Bot...")
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        bot_app = create_bot_app()
        bot_status["running"] = True
        loop.run_until_complete(bot_app.run_polling())
    except Exception as e:
        bot_status["running"] = False
        print(f"❌ Failed to start support bot: {e}")

@app.get("/api/v1/buy_esim/balance")
async def get_balance():
    try:
        data = await buy_esim.check_balance()
        balance_value = data.get("obj", {}).get("balance", 0)
        return {"balance": balance_value, "full_response": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking balance: {str(e)}")


# Run the update task and bot in background threads
threading.Thread(target=schedule_package_updates, daemon=True).start()
threading.Thread(target=run_support_bot, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")