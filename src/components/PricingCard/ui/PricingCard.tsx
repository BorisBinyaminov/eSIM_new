'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const PricingCard = ({
  name,
  price,
  data,
  duration,
  coverage = 0,
  supportTopUpType,
  locations,
}: {
  name?: string;
  description?: string;
  price:  number;
  data: string;
  duration: string;
  coverage?: number;
  supportTopUpType: number;
  locations?: string[];
  packageName?: string;
  type?: string
}) => {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("buyeSim");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bglight border-[2px] border-[#27A6E1] text-white px-[10px] py-[18px] rounded-[12px] shadow-lg w-80 mb-[70px]"
    >
      {/* <h3 className="text-[16px] text-white">{description}</h3> */}
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] font-[500]">{name}</h2>
        <span className="text-[24px] font-[700]">${(price/ 10000).toFixed(2)}</span>
      </div>
      <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center w-full mt-[18px] max-w-[328px]"
        >
          <Link 
            href="/buyEsim" 
            className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[24px] font-bold text-white"
          >
           {t("Buy now")}
          </Link>
        </motion.div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-sm bg-mainbg p-2 rounded-[16px]">
          <span className='flex gap-[8px] items-center bg-[]'>
            <Image src="/images/buyEsimPage/PricingCard/DataVolume.svg" width={24} height={24} alt="Data volume"/> {t("Data volume")}
          </span>
          <span className="text-[14px] text-[#27A6E1] font-[400]">{data}</span>
        </div>
        <div className="flex justify-between items-center text-sm bg-mainbg p-2 rounded-[16px]">
          <span className='flex gap-[8px] items-center'>
            <Image src="/images/buyEsimPage/PricingCard/Duration.svg" width={24} height={24} alt="Duration"/> {t("Duration")}
          </span>
          <span className="text-[14px] text-[#27A6E1] font-[400]">{duration}</span>
        </div>
        {coverage > 1 && (
          <div className="flex justify-between text-sm bg-mainbg p-2 rounded-lg">
            <span className='flex gap-[8px] items-center'>
              <Image src="/images/buyEsimPage/PricingCard/Coverage.svg" width={24} height={24} alt="Coverage"/> {t("Coverage")}
            </span>
            <span className="text-[14px] text-[#27A6E1] font-[400]">{coverage}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm bg-mainbg p-2 rounded-[16px]">
          <span className='flex gap-[8px] items-center'>
            <Image src="/images/buyEsimPage/PricingCard/TopUpSupport.svg" width={24} height={24} alt="Top-Up Support"/> {t("Top-Up Support")}
          </span>
          <span className="text-[14px] text-[#27A6E1] font-[400]">{supportTopUpType === 2 ? "Yes" : "No"}</span>
        </div>
        {locations && (
      <div className="relative group flex flex-col text-sm bg-mainbg p-2 rounded-lg">
        <div className={`flex justify-between ${expanded ? "flex-col" : ""}`}>
          <span className='flex gap-[8px] items-center w-[200px] w-full'>
            <Image src="/images/buyEsimPage/PricingCard/Location.svg" width={24} height={24} alt="Locations"/> {t("Locations")}
          </span>
          <span className="font-semibold w-[200px] w-full">
            {expanded ? locations.join(', ') : locations.slice(0, 3).join(', ')}
          </span>
        </div>

        {/* Show More Button */}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="mt-2 w-full bg-[#0a0a2c] text-white py-2 rounded-full text-center text-sm transition hover:opacity-80"
        >
          {expanded ? t("Show less") : t("Show more")}
        </button>
      </div>
    )}
      </div>
    </motion.div>
  );
};

export default PricingCard;
