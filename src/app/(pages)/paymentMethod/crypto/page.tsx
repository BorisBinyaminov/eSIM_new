"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CryptoPayment = () => {
  const router = useRouter();
  const [promocode, setPromocode] = useState("");
  const [promoError, setPromoError] = useState("");

  const validatePromoCode = (code: string) => {
    const regex = /^\d{4}$/;
    if (!regex.test(code)) {
      setPromoError("Промокод должен содержать ровно 4 цифры.");
    } else {
      setPromoError("");
    }
  };

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromocode(e.target.value);
  };

  const handlePromoBlur = () => {
    validatePromoCode(promocode);
  };

  return (
    <motion.div 
      className="px-6 py-4 bg-[#05081A] text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <motion.button 
          onClick={() => router.back()} 
          className="text-blue-400 hover:underline"
          whileHover={{ scale: 1.1 }}
        >
          <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="Back" />
        </motion.button>
        <motion.h1 
          className="text-lg font-bold"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Replenishment eSim
        </motion.h1>
      </div>

      <motion.button 
        className="mt-6 w-full py-3 bg-blue-500 rounded-xl text-white text-lg font-bold"
        whileHover={{ scale: 1.05 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        🔹 Connect wallet
      </motion.button>

      <motion.p 
        className="mt-3 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Min. replenishment amount <span className="font-bold text-white">5 USDT</span>
      </motion.p>
      <motion.p 
        className="text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        When paying, please indicate eSim id <span className="text-white">12232344</span>
      </motion.p>

      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-[#1D2240] to-[#000625] rounded-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-center text-sm text-gray-300">QR - for payment</p>
        <div className="mt-2 flex justify-center">
          <Image src="/images/qr-code.svg" width={200} height={200} alt="QR Code" />
        </div>
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <label className="bg-bglight text-sm">Address</label>
        <div className="mt-1 flex items-center bg-bglight rounded-lg px-3 py-2">
          <input
            type="text"
            value="dddfwq2q3erfer344twattesertrdf"
            readOnly
            className="bg-transparent text-white w-full outline-none"
          />
          <button className="ml-2 text-blue-400">📋</button>
        </div>
      </motion.div>

      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
      >
        <label className="text-red-400 text-sm">Required Comment</label>
        <div className="mt-1 flex items-center bg-bglight rounded-lg px-3 py-2">
          <input
            type="text"
            value="12232344"
            readOnly
            className="bg-transparent text-white w-full outline-none"
          />
          <button className="ml-2 text-blue-400">📋</button>
        </div>
      </motion.div>

      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <label className="text-gray-400 text-sm">Promocode</label>
        <input
          type="text"
          placeholder="0000"
          value={promocode}
          onChange={handlePromoChange}
          onBlur={handlePromoBlur}
          className="mt-1 w-full bg-bglight text-white rounded-lg px-3 py-2 outline-none"
        />
        {promoError && (
          <p className="mt-1 text-sm text-red-500">{promoError}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CryptoPayment;
