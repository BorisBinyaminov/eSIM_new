"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Choose eSIM Data Plan",
    text: "Pick an eSIM data plan that suits your needs. Stay connected with the entire world, anytime, anywhere.",
    image: "/images/mainpage/buyNow.svg",
  },
  {
    id: 2,
    title: "Easy Installation of eSIM",
    text: "Follow our simple step-by-step guide and scan the QR code for digital installation.",
    image: "/images/mainpage/installation.svg",
  },
  {
    id: 3,
    title: "Easy Activation of eSIM",
    text: "Follow our simple step-by-step guide for digital activation.",
    image: "/images/mainpage/activation.svg",
  },
  {
    id: 4,
    title: "Enjoy Your Connection",
    text: "Your eSIM is now activated! Enjoy seamless connectivity anywhere in the world.",
    image: "/images/mainpage/enjoy.svg",
  },
];

export default function EsimSlider() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Slider container */}
      <div className="relative mt-4 max-w-[328px] w-full bg-gradient-to-r from-[#1D2240] to-[#000625] rounded-[16px] h-[293px] flex justify-center items-center overflow-hidden">
      <button 
        onClick={prevSlide} 
        className="absolute left-4 z-10 cursor-pointer"
        >
            <motion.div
                whileHover={{ scale: 1.1 }} // Увеличивается при наведении
                whileTap={{ scale: 0.9 }} // Эффект нажатия
                transition={{ type: "spring", stiffness: 300, damping: 15 }} // Плавность
            >
                <Image src="/images/mainpage/arrowL.svg" alt="Previous" width={44} height={44} />
            </motion.div>
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute flex flex-col items-center "
          >
            <Image src={slides[index].image} alt={slides[index].title} width={115} height={149} />
          </motion.div>
        </AnimatePresence>

        <button 
            onClick={nextSlide} 
            className="absolute right-4 z-10 cursor-pointer"
            >
            <motion.div
                whileHover={{ scale: 1.1 }} // Немного увеличивается при наведении
                whileTap={{ scale: 0.9 }} // Создаёт эффект нажатия
                transition={{ type: "spring", stiffness: 300, damping: 15 }} // Плавный эффект
            >
                <Image src="/images/mainpage/arrowR.svg" alt="Next" width={44} height={44} />
            </motion.div>
        </button>
      </div>

      {/* Text and Navigation */}
      <div className="flex flex-col gap-4 items-center text-center mt-4">
        <motion.p 
          key={slides[index].title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="font-medium text-white"
        >
          {slides[index].title}
        </motion.p>

        <motion.p 
          key={slides[index].text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-light max-w-[328px] w-full text-white "
        >
          {slides[index].text}
        </motion.p>

        {/* Pagination */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`py-[10px] px-[16px] rounded-full font-medium text-[16px] transition-all cursor-pointer ${
                index === i
                  ? "bg-white text-black"
                  : "bg-gradient-to-r from-[#1D2240] to-[#000625] text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Button */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center  w-full max-w-[328px]"
        >
          <Link 
            href="/buyEsim" 
            className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[24px] font-bold text-white"
          >
            Get mobile data
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
