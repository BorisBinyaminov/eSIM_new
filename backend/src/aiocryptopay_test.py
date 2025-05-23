from aiocryptopay import AioCryptoPay, Networks
import asyncio

async def basic(): 
    crypto = AioCryptoPay(token='402922:AAwtpqK86NSGStKvU3WEyABLFkFN6dXoZ7B', network=Networks.MAIN_NET)

    profile = await crypto.get_me()
    currencies = await crypto.get_currencies()
    balance = await crypto.get_balance()
    rates = await crypto.get_exchange_rates()
    stats = await crypto.get_stats()

    print(profile, currencies, balance, rates, stats, sep='\n')

async def invoice():

    crypto = AioCryptoPay(token='402922:AAwtpqK86NSGStKvU3WEyABLFkFN6dXoZ7B', network=Networks.MAIN_NET)

    invoice = await crypto.create_invoice(asset='TON', amount=1.5)
    print(invoice.bot_invoice_url)

    # Create invoice in fiat
    fiat_invoice = await crypto.create_invoice(amount=5, fiat='USD', currency_type='fiat')
    print(fiat_invoice)

    old_invoice = await crypto.get_invoices(invoice_ids=invoice.invoice_id)
    print(old_invoice.status)

    deleted_invoice = await crypto.delete_invoice(invoice_id=invoice.invoice_id)
    print(deleted_invoice)

async def check():
    # The check creation method works when enabled in the application settings

  
    crypto = AioCryptoPay(token='402922:AAwtpqK86NSGStKvU3WEyABLFkFN6dXoZ7B', network=Networks.MAIN_NET)

    check = await crypto.create_check(asset='USDT', amount=1)
    print(check)

    old_check = await crypto.get_checks(check_ids=check.check_id)
    print(old_check)

    deleted_check = await crypto.delete_check(check_id=check.check_id)
    print(deleted_check)

if __name__ == "__main__":
    asyncio.run(basic())   