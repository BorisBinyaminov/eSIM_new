"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface DeviceCategory {
  name: string;
  devices?: string[];
}

interface BrandData {
  brand: string;
  categories: DeviceCategory[];
}

const SupportedDevicesPage = () => {
  // Список брендов
  const [brands, setBrands] = useState<BrandData[]>([]);
  // Выбранный бренд
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  // Выбранная категория
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);

  useEffect(() => {
    fetch("/esim_devices.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded data:", data);
        // Если JSON приходит в виде объекта с ключом devices, сразу устанавливаем его
        if (data.devices) {
          setBrands(data.devices);
        } else if (Array.isArray(data)) {
          setBrands(data);
        } else {
          console.error("Неверная структура данных:", data);
        }
      })
      .catch((err) => console.error("Failed to load data", err));
  }, []);

  let headerTitle = "Supported eSIM Devices";
  if (selectedCategory) {
    headerTitle = "Supported eSIM Devices";
  } else if (selectedBrand) {
    headerTitle = "Supported eSIM Devices";
  }

  return (
    <div className="p-4 text-white bg-mainbg min-h-screen">
      
      {/* Уровень брендов */}
      {!selectedBrand && (
        
        <div className="space-y-3">
            <h1 className="text-2xl font-bold mb-4">{headerTitle}</h1>
          {brands.map((brand, index) => (
            <button
              key={index}
              className="w-full bg-bglight text-left p-3 rounded-lg hover:bg-[#1E254B] transition"
              onClick={() => setSelectedBrand(brand)}
            >
              <span className="flex justify-between">
                {brand.brand}
                <Image src="/images/supportedDevice/arrow.svg" width={7} height={14} alt="arrow" className="w-[7px] h-[14px]"/>
              </span>
            </button>
          ))}
        </div>
      )}
      {/* Уровень категорий */}
      {selectedBrand && !selectedCategory && (
        <div className="space-y-3">
            <div className="flex gap-[18px]">
                <button
                    className="mb-3 text-blue-400 hover:underline"
                    onClick={() => {
                    setSelectedBrand(null);
                    setSelectedCategory(null);
                    }}
                >
                    <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="arrow" className="w-[12px] h-[24px]"/>
                </button>
                <h1 className="text-2xl font-bold mb-4">{headerTitle}</h1>
                
            </div>
          {selectedBrand.categories.map((category) => (
            <button
              key={category.name}
              className="w-full bg-bglight text-left p-3 rounded-lg hover:bg-[#1E254B] transition"
              onClick={() => setSelectedCategory(category)}
            >
                <span className="flex justify-between">
                    {category.name}
                    <Image src="/images/supportedDevice/arrow.svg" width={7} height={14} alt="arrow" className="w-[7px] h-[14px]"/>
                </span>
            </button>
          ))}
        </div>
      )}
      {/* Уровень устройств */}
      {selectedCategory && (
        <div className="space-y-3">
          <div className="flex gap-[18px]">
                <button
                    className="mb-3 text-blue-400 hover:underline"
                    onClick={() => {
                    setSelectedBrand(null);
                    setSelectedCategory(null);
                    }}
                >
                    <Image src="/images/supportedDevice/arrowL.svg" width={12} height={24} alt="arrow" className="w-[12px] h-[24px]"/>
                </button>
                <h1 className="text-2xl font-bold mb-4">{headerTitle}</h1>
                
            </div>
          {selectedCategory.devices?.map((device) => (
            <div
              key={device}
              className="w-full bg-bglight p-3 rounded-lg"
            >
              {device}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportedDevicesPage;
