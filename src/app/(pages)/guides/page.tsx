"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";


  

  export default function InstallationGuide() {
    const t = useTranslations("guides");
    const slides = [
      // IOS Installation
      {
        id: 1,
        type: "IOS",
        preType: "Installation",
        title: t("1.title"),
        step: t("1.step"),
        instruction: t("1.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-001.png",
      },
      {
        id: 2,
        type: "IOS",
        preType: "Installation",
        title: t("2.title"),
        step: t("2.step"),
        instruction: t("2.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-002.png",
      },
      {
        id: 3,
        type: "IOS",
        preType: "Installation",
        title: t("3.title"),
        step: t("3.step"),
        instruction: t("3.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-003.png",
      },
      {
        id: 4,
        type: "IOS",
        preType: "Installation",
        title: t("4.title"),
        step: t("4.step"),
        instruction: t("4.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-004.png",
      },
      {
        id: 5,
        type: "IOS",
        preType: "Installation",
        title: t("5.title"),
        step: t("5.step"),
        instruction: t("5.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-005.png",
      },
      {
        id: 6,
        type: "IOS",
        preType: "Installation",
        title: t("6.title"),
        step: t("6.step"),
        instruction: t("6.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-006.png",
      },
      {
        id: 7,
        type: "IOS",
        preType: "Installation",
        title: t("7.title"),
        step: t("7.step"),
        instruction: t("7.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-007.png",
      },
      {
        id: 8,
        type: "IOS",
        preType: "Installation",
        title: t("8.title"),
        step: t("8.step"),
        instruction: t("8.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-008.png",
      },
      {
        id: 9,
        type: "IOS",
        preType: "Installation",
        title: t("9.title"),
        step: t("9.step"),
        instruction: t("9.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-009.png",
      },
      {
        id: 10,
        type: "IOS",
        preType: "Installation",
        title: t("10.title"),
        step: t("10.step"),
        instruction: t("10.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-010.png",
      },
      {
        id: 11,
        type: "IOS",
        preType: "Installation",
        title: t("11.title"),
        step: t("11.step"),
        instruction: t("11.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-011.png",
      },
      {
        id: 12,
        type: "IOS",
        preType: "Installation",
        title: t("12.title"),
        step: t("12.step"),
        instruction: t("12.instruction"),
        image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-012.png",
      },
      // IOS Activation
      {
        id: 13,
        type: "IOS",
        preType: "Activation",
        title: t("13.title"),
        step: t("13.step"),
        instruction: t("13.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-001.png",
      },
      {
        id: 14,
        type: "IOS",
        preType: "Activation",
        title: t("14.title"),
        step: t("14.step"),
        instruction: t("14.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-002.png",
      },
      {
        id: 15,
        type: "IOS",
        preType: "Activation",
        title: t("15.title"),
        step: t("15.step"),
        instruction: t("15.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-003.png",
      },
      {
        id: 16,
        type: "IOS",
        preType: "Activation",
        title: t("16.title"),
        step: t("16.step"),
        instruction: t("16.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-004.png",
      },
      {
        id: 17,
        type: "IOS",
        preType: "Activation",
        title: t("17.title"),
        step: t("17.step"),
        instruction: t("17.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-005.png",
      },
      {
        id: 18,
        type: "IOS",
        preType: "Activation",
        title: t("18.title"),
        step: t("18.step"),
        instruction: t("18.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-006.png",
      },
      {
        id: 19,
        type: "IOS",
        preType: "Activation",
        title: t("19.title"),
        step: t("19.step"),
        instruction: t("19.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-007.png",
      },
      {
        id: 20,
        type: "IOS",
        preType: "Activation",
        title: t("20.title"),
        step: t("20.step"),
        instruction: t("20.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-008.png",
      },
      {
        id: 21,
        type: "IOS",
        preType: "Activation",
        title: t("21.title"),
        step: t("21.step"),
        instruction: t("21.instruction"),
        image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-009.png",
      },
      // Android Installation
      ...Array.from({ length: 11 }, (_, i) => ({
        id: 25 + i,
        type: "Android",
        preType: "Installation",
        title: t(`${25 + i}.title`),
        step: t(`${25 + i}.step`),
        instruction: t(`${25 + i}.instruction`),
        image: `/images/Android_installation/eSIM-EN-Orbister-Android-installation-00${i + 1}.png`,
      })),
      // Android Activation
      ...Array.from({ length: 9 }, (_, i) => ({
        id: 37 + i,
        type: "Android",
        preType: "Activation",
        title: t(`${37 + i}.title`),
        step: t(`${37 + i}.step`),
        instruction: t(`${37 + i}.instruction`),
        image: `/images/Android_activation/eSIM-EN-Orbister-Android-activation-00${i + 1}.png`,
      })),
    ];

    const [index, setIndex] = useState(0);
    const [platform, setPlatform] = useState<"IOS" | "Android">("IOS");
    const [guideType, setGuideType] = useState<"Installation" | "Activation">("Installation");
  
    const filteredSlides = slides.filter(
      (slide) => slide.type === platform && slide.preType === guideType
    );
  
    useEffect(() => {
      setIndex(0);
    }, [platform, guideType]);
  
    const nextSlide = () => setIndex((prev) => (prev + 1) % filteredSlides.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length);
  
    if (filteredSlides.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-white bg-[#0A0D1E] min-h-screen">
          <h2 className="text-2xl">No slides available for the selected options</h2>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col items-center text-white bg-[#05081A] min-h-screen mb-17">
        <h2 className="text-[32px] max-w-[328px] font-bold text-left w-full">Guides</h2>
        <div className=" w-full max-w-[328px] h-14 rounded-lg flex items-center justify-center mt-2">
          {(["IOS", "Android"] as const).map((item) => (
            <motion.div
              key={item}
              className={`cursor-pointer w-[153px] h-10 flex justify-center items-center rounded-md text-lg font-semibold transition-colors ${
                platform === item
                  ? "bg-gradient-to-r from-[#27A6E1] to-[#4381EB] text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setPlatform(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
        <div className="flex">
          {(["Installation", "Activation"] as const).map((item) => (
            <motion.div
              key={item}
              className={`cursor-pointer w-[153px] h-10 flex justify-center items-center text-lg font-semibold transition-colors ${
                guideType === item
                  ? "border-b-2 border-[#27A6E1] text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setGuideType(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between max-w-[328px] w-full">
            <h3 className="mt-4 text-xl font-semibold">{filteredSlides[index].title}</h3>
            <p className="text-sm text-gray-400">{filteredSlides[index].step}</p>
          </div>
        
        <div className="relative w-full max-w-[327px] mt-6 flex flex-col items-center bg-gradient-to-r from-[#1D2240] to-[#000625] rounded-[16px]">
          <button 
            onClick={prevSlide} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Image src="/images/mainpage/arrowL.svg" alt="Previous" width={44} height={44} className="w-[44px] h-[44px]"/>
            </motion.div>
          </button>
          
          
          <AnimatePresence mode="wait">
            <motion.div
              key={filteredSlides[index].id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col mt-[20px] items-center"
            >
              <Image
                src={filteredSlides[index].image}
                alt={filteredSlides[index].title}
                width={300}
                height={600}
                className="rounded-md w-[300px] h-[600px]"
              />
            </motion.div>
          </AnimatePresence>
          
          <button 
            onClick={nextSlide} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Image src="/images/mainpage/arrowR.svg" alt="Next" width={44} height={44} className="w-[44px] h-[44px]"/>
            </motion.div>
          </button>   
        </div>
        <div className="max-w-[326px] w-full flex items-center">
          <p className="mt-2 text-[16px] text-left w-full ">{filteredSlides[index].instruction}</p>
        </div>
        
      </div>
    );
  }