'use client'
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

const esims = [
    { id: 1, name: 'Global 5 GB', status: 'Active', usage: '200mb', orderDate: '22.02.2025', expiryDate: '22.03.2025' },
    { id: 2, name: 'Global 5 GB', status: 'Disactive', usage: '200mb', orderDate: '22.02.2025', expiryDate: '22.03.2025' },
  ];  

const MySims = () => {
    const [sims] = useState(esims);
    const t = useTranslations("myeSim");

    return (
      <div className="min-h-screen bg-[#05081A] text-white p-6">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <div className="space-y-6">
          {sims.map((sim) => (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 border border-gray-700 rounded-xl bg-bglight shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{sim.name}</h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    sim.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {sim.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-300">
                <p><strong>{t("usage")}</strong> {sim.usage}</p>
                <p><strong>{t("order")}</strong> {sim.orderDate}</p>
                <p><strong>{t("expired")}</strong> {sim.expiryDate}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="text-center w-full max-w-[85px]"
                >
                    <button className=" max-w-[85px] w-full px-4 py-2 border-[#27A6E1] border-[1px] rounded-[16px] transition">{t("cancel")}</button>
                </motion.div>
                
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center w-full max-w-[328px]"
                    >
                    <div 
                        className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[16px] font-bold text-white"
                    >
                       {t("top-up")}
                    </div>
                    </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
  )
}

export default MySims 
