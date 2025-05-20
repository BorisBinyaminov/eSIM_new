import { create } from 'zustand'

interface PurchaseState {
  selectedPackage: any
  setSelectedPackage: (pkg: any) => void
  clearSelectedPackage: () => void
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  clearSelectedPackage: () => set({ selectedPackage: null }),
}))
