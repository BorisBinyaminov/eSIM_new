'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const BankPayment = () => {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [term, setTerm] = useState("");
  const [cvc, setCvc] = useState("");
  const [promocode, setPromocode] = useState("");
  const t = useTranslations("bank");

  const [errors, setErrors] = useState({
    cardNumber: "",
    term: "",
    cvc: "",
    promocode: ""
  });

  const validateCardNumber = (number : string) => {
    const sanitized = number.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(sanitized)) {
      return t("The card number must contain 16 digits");
    }
    return "";
  };

  const validateTerm = (term: string) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(term)) {
      return t("The expiration date must be in MM/YY format");
    }
    return "";
  };

  const validateCvc = (cvc: string) => {
    if (!/^\d{3}$/.test(cvc)) {
      return t("CVC must contain 3 digits");
    }
    return "";
  };

  const validatePromocode = (code: string) => {
    if (code && !/^\d{4}$/.test(code)) {
      return t("The promo code must contain 4 digits");
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardError = validateCardNumber(cardNumber);
    const termError = validateTerm(term);
    const cvcError = validateCvc(cvc);
    const promoError = validatePromocode(promocode);
    setErrors({
      cardNumber: cardError,
      term: termError,
      cvc: cvcError,
      promocode: promoError,
    });
    if (!cardError && !termError && !cvcError && !promoError) {
      console.log(t("Form sending"), { cardNumber, term, cvc, promocode });
    }
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
          <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="arrow" />
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

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-gray-400">{t("total")}</p>
        <p className="text-3xl font-bold">$33.00</p>
      </motion.div>

      <motion.form 
        className="mt-6"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="mb-4">
          <label className="block text-gray-400">{t("Card number")}</label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-bglight border border-[#27A6E1] p-3 rounded-[16px] text-white mt-2"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-400">{t("Term")}</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full bg-bglight p-3 rounded-[16px] text-white border border-[#27A6E1] mt-2"
            />
            {errors.term && (
              <p className="text-red-500 text-sm mt-1">{errors.term}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400">CVC</label>
            <input
              type="text"
              placeholder="000"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full border border-[#27A6E1] bg-bglight p-3 rounded-[16px] text-white mt-2"
            />
            {errors.cvc && (
              <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400">{t("PROMOCODE")}</label>
          <input
            type="text"
            placeholder="0000"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value)}
            className="w-full bg-bglight border border-[#27A6E1] p-3 rounded-[16px] text-white mt-2"
          />
          {errors.promocode && (
            <p className="text-red-500 text-sm mt-1">{errors.promocode}</p>
          )}
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" className="w-5 h-5 text-blue-500" />
          <p className="ml-2 text-gray-400">{t("Remember card for future purchases")}</p>
        </div>

        <motion.button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-lg font-bold rounded-[16px] shadow-lg"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {t("Buy now")}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default BankPayment;
