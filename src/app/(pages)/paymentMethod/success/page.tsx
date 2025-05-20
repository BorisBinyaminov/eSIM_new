'use client'
import { useEffect, useState } from 'react'
import { usePurchaseStore } from '@/store/usePurchaseStore'
import { useAuth } from '@/components/AuthProvider/AuthProvider'
import { finalizePurchase } from '@/lib/finalizePurchase'

export default function PaymentSuccessPage() {
  const { user } = useAuth()
  const selectedPackage = usePurchaseStore(state => state.selectedPackage)
  const [message, setMessage] = useState("Finalizing your purchase...")

  useEffect(() => {
    if (!user || !selectedPackage) {
      setMessage("Missing data.")
      return
    }

    finalizePurchase(selectedPackage, String(user.id))
      .then((json) => {
        if (json.success) {
          setMessage("✅ eSIM purchase complete!")
        } else {
          setMessage("❌ eSIM purchase failed: " + (json.error || "Unknown error"))
        }
      })
      .catch(() => setMessage("Network error."))
  }, [selectedPackage, user])

  return (
    <div className="p-4 text-white">
      <h1>{message}</h1>
    </div>
  )
}
