export async function finalizePurchase(pkg: any, userId: string) {
  const res = await fetch("https://mini.torounlimitedvpn.com/esim/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": String(userId),
    },
    body: JSON.stringify({
      package_code: pkg.packageCode,
      order_price: pkg.price,
      retail_price: pkg.retailPrice,
      period_num: pkg.period_num,
      count: pkg.count,
    }),
  });

  const json = await res.json();
  return json;
}