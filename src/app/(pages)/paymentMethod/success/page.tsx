'use client'

import { useEffect, useState } from 'react'
import { usePurchaseStore } from '@/store/usePurchaseStore'
import { useAuth } from '@/components/AuthProvider/AuthProvider'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const { user } = useAuth()
  const selectedPackage = usePurchaseStore(state => state.selectedPackage)
  const [message, setMessage] = useState("Finalizing your purchase...")
  const [showSpinner, setShowSpinner] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const finalize = async () => {
      if (!user || !selectedPackage) {
        setMessage("❌ Missing user or package data.")
        return
      }

      try {
        const res = await fetch("https://mini.torounlimitedvpn.com/esim/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": String(user.id),
          },
          body: JSON.stringify({
            package_code: selectedPackage.packageCode,
            order_price: selectedPackage.price,
            retail_price: selectedPackage.retailPrice,
            period_num: selectedPackage.period_num,
            count: selectedPackage.count,
          }),
        })

        const json = await res.json()
        if (json.success) {
          setMessage("✅ eSIM purchase complete! Redirecting to My eSIM page...")
          setShowSpinner(true)
          setTimeout(() => {
            router.push('/myEsim')
          }, 2500)
        } else {
          setMessage("❌ eSIM purchase failed: " + (json.error || "Unknown error"))
        }
      } catch (err) {
        console.error(err)
        setMessage("❌ Network or server error.")
      }
    }

    finalize()
  }, [user, selectedPackage])

  return (
    <div className="p-6 text-white bg-[#05081A] min-h-screen flex flex-col justify-center items-center text-center gap-4">
      <h1 className="text-xl font-semibold">{message}</h1>
      {showSpinner && (
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  )
}
