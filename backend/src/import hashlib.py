import hashlib
import hmac
from urllib.parse import parse_qsl
import json

# === 📝 Paste your data here ===
bot_token = "8073824494:AAHQlUVQpvlzBFX_5kfjD02tcdRkjGTGBeI"
init_data = """user={"id":5102625060,"first_name":"Boris","last_name":"","username":"Boris_binya","language_code":"ru","is_premium":true,"allows_write_to_pm":true,"photo_url":"https://t.me/i/userpic/320/CxltXsX1m3GWz5YvOCkViORzYbfNl5hm_wQg_UCvGqVg1e6hJF4Tv06mtHTgy8Tl.svg"}&chat_instance=-1455389254629648718&chat_type=sender&auth_date=1746368291&signature=L3pd23Y_geWJzHXr8JhLVSgu6kcY9rC_KRWK5Fgicav_sIZqSfQOItb7z0HNcDpucLD3Eh974pBASVohcXf4DQ&hash=03179c1cb708bfbf8dbf566d189556a30cb7b16adf44b18e227b0799cf771345"""
# ==============================

# Step 1: Parse key-values from initData
data = dict(parse_qsl(init_data, keep_blank_values=True))
received_hash = data.pop("hash", None)

# Step 2: Build check string (sorted keys)
check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))

# Step 3: Compute HMAC SHA256 hash
secret_key = hashlib.sha256(bot_token.encode()).digest()
computed_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()

# Step 4: Output results
print("\n🔍 Parsed initData:")
for k, v in sorted(data.items()):
    print(f"  {k} = {v}")

print("\n🧾 check_string to hash:")
print(check_string)

print("\n🔐 Hash values:")
print("  ✅ Computed :", computed_hash)
print("  📦 Received :", received_hash)
print("  🎯 Match    :", computed_hash == received_hash)
