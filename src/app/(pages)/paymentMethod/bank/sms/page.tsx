'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function ReplenishmentEsimPage() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const t = useTranslations("sms");

  useEffect(() => {
  const interval = isTimerActive && timer > 0
    ? setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000)
    : undefined;

  if (timer === 0) {
    setIsTimerActive(false);
  }

  return () => {
    if (interval !== undefined) {
      clearInterval(interval);
    }
  };
}, [timer, isTimerActive]);


  const handleResend = () => {
    setTimer(30);
    setIsTimerActive(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-mainbg flex flex-col items-center"
    >
        <div className="flex items-center gap-4 w-full max-w-[328px]">
                <motion.button 
                  onClick={() => router.back()} 
                  className="text-blue-400 hover:underline"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="arrow" className='w-[12px] h-[24px]'/>
                </motion.button>
                <motion.h1 
                  className="text-lg font-bold"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                 {t("Replenishment eSim")}
                </motion.h1>
              </div>
      <h2 className="text-white text-2xl mb-4 text-left w-full max-w-[328px] mt-[48px]">{t("SMS from your phone")}</h2>

      <input
        type="text"
        placeholder="000 000"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-[328px] bg-bglight border border-[#27A6E1] p-3 rounded-[16px] text-white text-center mt-2 placeholder-white/50 focus:outline-none"
      />

      <motion.button
        onClick={handleResend}
        disabled={isTimerActive}
        whileHover={{ scale: isTimerActive ? 1 : 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-[328px] text-left px-[10px] h-[39px] rounded-[16px] text-lg font-bold shadow-lg mt-4 transition-colors ${
          isTimerActive
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
        }`}
      >
        {isTimerActive
          ? `${t("Send SMS again")} (${timer}s)`
          : t("Send SMS again")}
      </motion.button>

      {/* Кнопка "Confirm" */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-[328px] w-full mt-[48px] py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-lg font-bold rounded-[16px] shadow-lg"
      >
        {t("Confirm")}
      </motion.button>
    </motion.div>
  );
}
