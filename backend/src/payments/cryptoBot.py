from aiocryptopay import AioCryptoPay, Networks
from dotenv import load_dotenv
import os

load_dotenv()

CRYPTO_TOKEN_MAIN = SUPPORT_BOT = os.getenv("CRYPTO_BOT_TOKEN")
#CRYPTO_TOKEN_TEST=  "40801:AALyyydklMsbSmlDwgdU8Ea0v3qBfAt99cJ"
NETWORK = Networks.MAIN_NET

cpay = AioCryptoPay(token=CRYPTO_TOKEN_MAIN, network=NETWORK)

async def create_crypto_invoice(amount: float, description: str):
    invoice = await cpay.create_invoice(
        amount=amount,
        description=description,
        hidden_message="Thanks for your payment!",
        paid_btn_name="openBot",
        fiat="USD",
        currency_type = "fiat",
        paid_btn_url=f"https://t.me/eSIMUnlimitedbot?start=paid",
    )
    return invoice
