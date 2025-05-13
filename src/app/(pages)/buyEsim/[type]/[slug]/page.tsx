'use client'
import { useState, useEffect } from 'react'
import { PricingCard } from '@/components/PricingCard'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import 'swiper/css'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/components/AuthProvider/AuthProvider'

// Data interfaces
interface Operator {
  operatorName: string
  networkType: string
}

interface LocationNetwork {
  locationName: string
  locationLogo: string
  locationCode: string
  operatorList: Operator[]
}

export interface Package {
  packageCode: string
  slug: string
  name: string
  price: number
  currencyCode: string
  volume: number
  smsStatus: number
  dataType: number
  unusedValidTime: number
  duration: number
  durationUnit: string
  location: string
  description: string
  activeType: number
  favorite: boolean
  retailPrice: number
  supportTopUpType: number
  fupPolicy: string
  locationNetworkList: LocationNetwork[]
  volumeGB?: string
}

// Modal for purchase steps
interface PurchaseModalProps {
  pkg: Package
  step: 1 | 2
  days: number
  count: number
  onChange: (field: 'days' | 'count', value: number) => void
  onCancel: () => void
  onConfirm: () => void
}

function PurchaseModal({ pkg, step, days, count, onChange, onCancel, onConfirm }: PurchaseModalProps) {
  const isDaily = pkg.duration === 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="text-lg font-bold mb-4 text-center">{pkg.name}</h3>

        {isDaily && step === 1 && (
          <>
            <p className="mb-2">🕓 This is a daily plan. How many days do you need?</p>
            <input
              type="number"
              min={1}
              value={days}
              onChange={e => onChange('days', Math.max(1, +e.target.value))}
              className="w-full border rounded mt-1 p-2"
            />
          </>
        )}

        {(!isDaily || step === 2) && (
          <>
            <p className="mb-2">📱 How many eSIMs would you like to purchase?</p>
            <input
              type="number"
              min={1}
              value={count}
              onChange={e => onChange('count', Math.max(1, +e.target.value))}
              className="w-full border rounded mt-1 p-2"
            />
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">
            {isDaily && step === 1 ? 'Next' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CountryPage() {
  const { type, slug } = useParams() as { type: string; slug: string }
  const displayType = type.charAt(0).toUpperCase() + type.slice(1)
  const [packagesData, setPackagesData] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const t = useTranslations('buyeSim')

  if (authLoading) {
    return <div className="text-white text-center mt-10">🔐 Authorizing...</div>
  }

  // Fetch packages based on type/slug
  useEffect(() => {
    async function fetchPackages() {
      setLoading(true)
      try {
        let data: Package[] = []
        if (type === 'local') {
          const res = await fetch('/countryPackages.json')
          data = (await res.json()) as Package[]
          data = data.filter(pkg => pkg.slug.toLowerCase().startsWith(slug.toLowerCase()))
        } else if (type === 'regional') {
          const res = await fetch('/regionalPackages.json')
          data = (await res.json()) as Package[]
          data = data.filter(pkg => pkg.slug.toLowerCase().startsWith(slug.toLowerCase()))
        } else if (type === 'global') {
          const res = await fetch('/globalPackages.json')
          data = (await res.json()) as Package[]
        }

        // Add human-readable volume and sort by price
        const enriched = data.map(pkg => ({ ...pkg, volumeGB: `${pkg.volume}GB` }))
        enriched.sort((a, b) => a.retailPrice - b.retailPrice)
        setPackagesData(enriched)
      } catch (error) {
        console.error('Failed to load packages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [type, slug])

  // State for multi-step purchase flow
  const [pendingPurchase, setPendingPurchase] = useState<{
    pkg: Package
    step: 1 | 2
    days: number
    count: number
  } | null>(null)

  // Initialize purchase
  const handleBuyNow = (pkg: Package) => {
    const step = pkg.duration === 1 ? 1 : 2
    setPendingPurchase({ pkg, step, days: 1, count: 1 })
  }

  // Confirm or advance steps
  const onConfirmPurchase = async () => {
    if (!pendingPurchase) return
    const { pkg, step, days, count } = pendingPurchase

    // If daily plan and first step, go to count
    if (pkg.duration === 1 && step === 1) {
      setPendingPurchase({ ...pendingPurchase, step: 2 })
      return
    }

    // Finalize purchase
    const periodNum = pkg.duration === 1 ? days : pkg.duration
    try {
      const res = await fetch('https://mini.torounlimitedvpn.com/esim/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': String(user?.id || ''),
        },
        body: JSON.stringify({
          package_code: pkg.packageCode,
          order_price: pkg.price,
          retail_price: pkg.retailPrice,
          count,
          period_num: periodNum,
        }),
      })
      const json = await res.json()
      if (json.success) {
        alert('✅ Purchase successful!')
      } else {
        alert('❌ Purchase failed: ' + (json.error || 'Unknown error'))
      }
    } catch (err) {
      console.error(err)
      alert('❌ Network error. Please try again.')
    } finally {
      setPendingPurchase(null)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-mainbg">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/buyEsim" className="text-blue-500 underline">
          <Image src="/images/buyEsimPage/arrowL.svg" width={14} height={24} alt="Back" />
        </Link>
        <h1 className="text-[16px] font-bold text-white">
          {displayType === 'Global'
            ? slug.replace(/-/g, ' ')
            : loading
            ? 'Loading...'
            : `${t('Available Packages for')} ${packagesData[0]?.name}`}
        </h1>
      </div>

      {loading ? (
        <div className="text-white text-center">Loading packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packagesData.map(pkg => (
            <PricingCard
              key={pkg.packageCode}
              name={pkg.name}
              description={pkg.description}
              price={pkg.retailPrice}
              data={pkg.volumeGB!}                 
              duration={`${pkg.duration} ${pkg.durationUnit}`}
              supportTopUpType={pkg.supportTopUpType}
              locations={pkg.locationNetworkList.map(n => n.locationName)}
              coverage={pkg.locationNetworkList.length}
              onBuy={() => handleBuyNow(pkg)}
            />
          ))}
        </div>
      )}

      {/* Purchase modal overlay */}
      {pendingPurchase && (
        <PurchaseModal
          pkg={pendingPurchase.pkg}
          step={pendingPurchase.step}
          days={pendingPurchase.days}
          count={pendingPurchase.count}
          onChange={(field, value) =>
            setPendingPurchase(prev => prev ? { ...prev, [field]: value } : prev)
          }
          onCancel={() => setPendingPurchase(null)}
          onConfirm={onConfirmPurchase}
        />
      )}
    </div>
  )
}