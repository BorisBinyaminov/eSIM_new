"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
    // IOS Installation
    {
      id: 1,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 1 of 12",
      instruction: "On Settings > Tap Connections.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-001.png",
    },
    {
      id: 2,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 2 of 12",
      instruction: "Select the appropriate network option.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-002.png",
    },
    {
      id: 3,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 3 of 12",
      instruction: "Tap on eSIM Settings.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-003.png",
    },
    {
      id: 4,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 4 of 12",
      instruction: "Press Add Cellular Plan.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-004.png",
    },
    {
      id: 5,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 5 of 12",
      instruction: "Scan the QR code provided.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-005.png",
    },
    {
      id: 6,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 6 of 12",
      instruction: "Wait for the plan to download.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-006.png",
    },
    {
      id: 7,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 7 of 12",
      instruction: "Confirm the installation details.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-007.png",
    },
    {
      id: 8,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 8 of 12",
      instruction: "Review the plan options.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-008.png",
    },
    {
      id: 9,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 9 of 12",
      instruction: "Select your preferred plan.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-009.png",
    },
    {
      id: 10,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 10 of 12",
      instruction: "Confirm your selection.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-010.png",
    },
    {
      id: 11,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 11 of 12",
      instruction: "Finalize installation settings.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-011.png",
    },
    {
      id: 12,
      type: "IOS",
      preType: "Installation",
      title: "IOS Installation",
      step: "Step 12 of 12",
      instruction: "Installation complete. Enjoy your connection.",
      image: "/images/IOS_installation/eSIM-EN-Orbister-iOS-installation-012.png",
    },
    // IOS Activation
    {
      id: 13,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 1 of 9",
      instruction: "Follow the activation guide to enable your eSIM.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-001.png",
    },
    {
      id: 14,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 2 of 9",
      instruction: "Confirm your device details.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-002.png",
    },
    {
      id: 15,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 3 of 9",
      instruction: "Tap on Activate eSIM.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-003.png",
    },
    {
      id: 16,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 4 of 9",
      instruction: "Verify your network connection.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-004.png",
    },
    {
      id: 17,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 5 of 9",
      instruction: "Wait for the activation process to start.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-005.png",
    },
    {
      id: 18,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 6 of 9",
      instruction: "Review the activation instructions.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-006.png",
    },
    {
      id: 19,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 7 of 9",
      instruction: "Confirm activation details.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-007.png",
    },
    {
      id: 20,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 8 of 9",
      instruction: "Select your data plan.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-008.png",
    },
    {
      id: 21,
      type: "IOS",
      preType: "Activation",
      title: "IOS Activation",
      step: "Step 9 of 9",
      instruction: "Verify your plan details.",
      image: "/images/IOS_activation/eSIM-EN-Orbister-iOS-activation-009.png",
    },
    // Android Installation 
    {
      id: 25,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 1 of 11",
      instruction: "On Settings > Go to Connections.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-001.png",
    },
    {
      id: 26,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 2 of 11",
      instruction: "Open Network & Internet settings.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-002.png",
    },
    {
      id: 27,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 3 of 11",
      instruction: "Tap on Mobile Network.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-003.png",
    },
    {
      id: 28,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 4 of 11",
      instruction: "Select Add Carrier.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-004.png",
    },
    {
      id: 29,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 5 of 11",
      instruction: "Scan the provided QR code.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-005.png",
    },
    {
      id: 30,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 6 of 11",
      instruction: "Wait for the carrier to be added.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-006.png",
    },
    {
      id: 31,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 7 of 11",
      instruction: "Confirm the plan details.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-007.png",
    },
    {
      id: 32,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 8 of 11",
      instruction: "Review your network settings.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-008.png",
    },
    {
      id: 33,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 9 of 11",
      instruction: "Select your data plan.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-009.png",
    },
    {
      id: 34,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 10 of 11",
      instruction: "Confirm your selection.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-010.png",
    },
    {
      id: 35,
      type: "Android",
      preType: "Installation",
      title: "Android Installation",
      step: "Step 11 of 11",
      instruction: "Finalize installation settings.",
      image: "/images/Android_installation/eSIM-EN-Orbister-Android-installation-011.png",
    },
    {
      id: 37,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 1 of 9",
      instruction: "Follow the steps to activate your eSIM.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-001.png",
    },
    {
      id: 38,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 2 of 9",
      instruction: "Confirm your device settings.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-002.png",
    },
    {
      id: 39,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 3 of 9",
      instruction: "Tap on Activate eSIM.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-003.png",
    },
    {
      id: 40,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 4 of 9",
      instruction: "Verify your network connection.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-004.png",
    },
    {
      id: 41,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 5 of 9",
      instruction: "Wait for the activation process to start.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-005.png",
    },
    {
      id: 42,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 6 of 9",
      instruction: "Review the activation instructions.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-006.png",
    },
    {
      id: 43,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 7 of 9",
      instruction: "Confirm activation details.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-007.png",
    },
    {
      id: 44,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 8 of 9",
      instruction: "Select your data plan.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-008.png",
    },
    {
      id: 45,
      type: "Android",
      preType: "Activation",
      title: "Android Activation",
      step: "Step 9 of 9",
      instruction: "Verify your plan details.",
      image: "/images/Android_activation/eSIM-EN-Orbister-Android-activation-009.png",
    },
  ];
  

  export default function InstallationGuide() {
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
              <Image src="/images/mainpage/arrowL.svg" alt="Previous" width={44} height={44} />
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
                className="rounded-md"
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
              <Image src="/images/mainpage/arrowR.svg" alt="Next" width={44} height={44} />
            </motion.div>
          </button>   
        </div>
        <div className="max-w-[326px] w-full flex items-center">
          <p className="mt-2 text-[16px] text-left w-full ">{filteredSlides[index].instruction}</p>
        </div>
        
      </div>
    );
  }