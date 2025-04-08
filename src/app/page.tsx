'use client'

import { ESIMSlider } from "@/components/eSimSlider";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";


function Home() {
  const t = useTranslations("MainPage");

  const advantages = [
    {
      id: 1,
      image: {
        path: "/images/mainpage/1.svg",
        width: 43,
        height: 43,
        alt: "Two way call"
      },
      text: t("advantages.twoWay.name"),
      description: t("advantages.twoWay.desc")
    },
    {
      id: 2,
      image: {
        path: "/images/mainpage/5.svg",
        width: 48,
        height: 48,
        alt: "Convenient Payment Options"
      },
      text: t("advantages.convenient.name"),
      description: t("advantages.convenient.desc")
    },
    {
      id: 3,
      image: {
        path: "/images/mainpage/3.svg",
        width: 48,
        height: 48,
        alt: "24/7 Customer Support"
      },
      text: t("advantages.24/7.name"),
      description: t("advantages.24/7.desc")
    },
    {
      id: 4,
      image: {
        path: "/images/mainpage/4.svg",
        width: 48,
        height: 48,
        alt: "Transparent Conditions"
      },
      text: t("advantages.transparent.name"),
      description: t("advantages.transparent.desc")
    },
    {
      id: 5,
      image: {
        path: "/images/mainpage/6.svg",
        width: 48,
        height: 48,
        alt: "User-friendly Interface"
      },
      text: t("advantages.user-friendly.name"),
      description: t("advantages.user-friendly.desc")
    },
    {
      id: 6,
      image: {
        path: "/images/mainpage/7.svg",
        width: 48,
        height: 48,
        alt: "Quick and Seamless Setup"
      },
      text: t("advantages.quick.name"),
      description: t("advantages.quick.desc")  
    },
  ];

  return (
    <main className="flex flex-col bg-[#05081A]">
      <div className="bg-bglight flex flex-col items-center rounded-[16px] pb-[53px]">
        <Image className="absolute w-[332px] h-[332px]" src="/images/mainpage/WorldMap.svg" width={332} height={332} alt="World map"/>
        <p className="z-30 mt-[53px] text-[32px] text-center text-white">{t("Stay-Connected-Anywhere")}</p>
        <p className="text-[16px] text-center mt-[16px] text-white">{t("with")}</p>
        <h1 className="mt-[48px] text-[48px] bg-gradient-to-b from-[#27A6E1] to-[#4381EB] bg-clip-text text-transparent font-bold">{t("eSim Unlimited")}</h1>
        <p className="text-[16px] text-center mt-[16px] px-[40px] text-white">{t("High-speed")}</p>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center mt-[48px] w-full max-w-[328px]"
        >
          <Link 
            href="/buyEsim" 
            className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[24px] font-bold text-white"
          >
            {t("Buy eSim")}
          </Link>
        </motion.div>
      </div>
      <div className="pt-[50px] bg-[#05081A]">
        <h3 className="text-[32px] text-center text-white">{t("Our Advantages")}</h3>
        <div className="mt-[24px] flex flex-col items-center gap-[16px]">
          {advantages.map(advantage=> 
              <div key={advantage.id} className="max-w-[328px] w-full bg-gradient-to-r from-[#1D2240] to-[#000625] rounded-[16px] flex flex-col items-center text-center py-[18px] gap-[16px] px-[18px]">
                <Image src={advantage.image.path} width={advantage.image.width} height={advantage.image.height} alt={advantage.image.alt} style={{width: `${advantage.image.width}`, height: `${advantage.image.height}` }}/>
                <p className="text-[16px] font-[600] font-roboto text-white">{advantage.text}</p>
                <p className="text-[16px] font-[300] text-white">{advantage.description}</p>
              </div>
          )}
           <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center  w-full max-w-[328px]"
        >
          <Link 
            href="/buyEsim" 
            className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[24px] font-bold text-white"
          >
            {t("Try Now")}
          </Link>
        </motion.div>

        </div>
      </div>
      <div className="flex flex-col mt-[50px] items-center mb-[120px] text-white">
        <h3 className="text-[32px] font-[400] text-white">{t("eSIM Setup Guide")}</h3>
        <p className="mt-[24px] text-[16px] font-[300] px-[16px] text-center text-white">{t("Take these")}</p>
        <ESIMSlider/>
      </div >

    </main>
  );
}

export default Home;
