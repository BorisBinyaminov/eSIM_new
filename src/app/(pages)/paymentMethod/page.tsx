'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

const Page = () => {
  const router = useRouter();
  const t = useTranslations("payment");
  return (
    <motion.div 
      className='px-6 bg-[#05081A] min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex gap-[18px]">
        <motion.button
          className="mb-3 text-blue-400 hover:underline"
          whileHover={{ scale: 1.1 }}
          onClick={() => router.back()}
        >
          <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="arrow" className='w-[12px] h-[24px]'/>
        </motion.button>
        <motion.h1 
          className="text-[16px] font-bold"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {t("select")}
        </motion.h1>
      </div>
      <div className='mt-[36px] flex flex-col gap-[9px]'>
        <motion.a 
          href='paymentMethod/bank' 
          className="px-[18px] py-[28px] bg-bglight rounded-[20px] flex items-center gap-[16px]"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image src="/images/PaymentMethod/bank.svg" width={32} height={32} alt="Bank" className='w-[32px] h-[32px]'/>
          <p className="text-[16px] font-bold text-white">{t("bank")}</p>
        </motion.a>
        <motion.a 
          href="paymentMethod/crypto" 
          className='px-[18px] py-[28px] bg-bglight rounded-[20px] flex items-center gap-[16px]'
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Image src="/images/PaymentMethod/crypto.svg" width={32} height={32} alt="Cryptocurrency" className='w-[32px] h-[32px]'/>
          <p className='text-[16px] font-bold text-white'>{t("crypto")}</p>
        </motion.a>
      </div>
    </motion.div>
  )
}

export default Page
