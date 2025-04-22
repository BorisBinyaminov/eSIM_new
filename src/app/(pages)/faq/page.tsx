'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";




const FAQItem = ({ question, answer,index}: { question: string; answer: string ; index:number}) => {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bglight rounded-[16px] w-full mx-[16px] " 
      
    >
      <button
        className="w-full text-left p-4 bg-bglight text-white flex justify-between items-center rounded-[16px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-[19px] items-center">
            <span className="bg-gradient-to-b from-[#27A6E1] to-[#4381EB] bg-clip-text text-transparent font-bold text-[16px]">{index >= 9 ? "": "0"}{index + 1}</span>
            <span className="text-[16px] font-semibold max-w-[216px] w-full">{question}</span>
        </div>
        <motion.span
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#27A6E1] to-[#4381EB] flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/images/faq/arrow.svg"
            alt="Arrow"
            width={14}
            height={28}
            className="w-auto h-auto"
          />
        </motion.span>

      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-bglight text-gray-300" >
        {answer.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQPage = () => {
  const t = useTranslations("faq");

  const faqs = [
    { question: t("1.question"), answer: t("1.answer") },
    { question: t("2.question"), answer: t("2.answer") },
    { question: t("3.question"), answer: t("3.answer") },
    { question: t("4.question"), answer: t("4.answer") },
    { question: t("5.question"), answer: t("5.answer") },
    { question: t("6.question"), answer: t("6.answer") },
    { question: t("7.question"), answer: t("7.answer") },
    { question: t("8.question"), answer: t("8.answer") },
    { question: t("9.question"), answer: t("9.answer") },
    { question: t("10.question"), answer: t("10.answer") },
    { question: t("11.question"), answer: t("11.answer") },
    { question: t("12.question"), answer: t("12.answer") },
    { question: t("13.question"), answer: t("13.answer") },
    { question: t("14.question"), answer: t("14.answer") },
    { question: t("15.question"), answer: t("15.answer") },
    { question: t("16.question"), answer: t("16.answer") },
    { question: t("17.question"), answer: t("17.answer") },
    { question: t("18.question"), answer: t("18.answer") },
    { question: t("19.question"), answer: t("19.answer") },
    { question: t("20.question"), answer: t("20.answer") },
    { question: t("21.question"), answer: t("21.answer") },
    { question: t("22.question"), answer: t("22.answer") },
    { question: t("23.question"), answer: t("23.answer") },
    { question: t("24.question"), answer: t("24.answer") }
  ];
  return (
    <div className="px-[16px] mb-[70px] bg-[#05081A]">        
        <h1 className="text-left text-[32px] text-white max-w-lg mx-auto">{t("FAQ")}</h1>
        <div className="flex flex-col gap-[16px] max-w-lg mx-auto mt-10 text-white rounded-lg shadow-lg overflow-hidden items-center">
            {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index}/>
            ))}
        </div>
    </div>
  );
};

export default FAQPage;
