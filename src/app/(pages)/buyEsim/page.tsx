'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

type CountryItem = {
  id: number;
  code: string;
  name: string;
  image: {
    path: string;
    alt: string;
  };
};

type PackageItem = {
  packageCode: string;
  slug: string;
  name: string;
  location: string;
};

type RegionalItem = {
  id: number;
  name: string;
  filter: string;
  image: {
    path: string;
    alt: string;
  };
};

type GlobalItem = {
  id: number;
  name: string;
  filter: string;
  image: {
    path: string;
    alt: string;
  };
};

export default function BuyESIM() {
  const t = useTranslations("buyeSim");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"Local" | "Regional" | "Global">("Local");
  const [localCountries, setLocalCountries] = useState<CountryItem[]>([]);
  const [countryPackages, setCountryPackages] = useState<PackageItem[]>([]);
  const [regionalPackages, setRegionalPackages] = useState<PackageItem[]>([]);
  const [globalPackages, setGlobalPackages] = useState<PackageItem[]>([]);
  const [availableLocal, setAvailableLocal] = useState<CountryItem[]>([]);
  const [availableRegional, setAvailableRegional] = useState<RegionalItem[]>([]);
  const [availableGlobal, setAvailableGlobal] = useState<GlobalItem[]>([]);
  
  // Добавляем состояние для показа/скрытия полного списка стран
  const [showAll, setShowAll] = useState(false);

  // Оборачиваем массивы в useMemo, чтобы их ссылка оставалась стабильной
  const regionalItems = useMemo<RegionalItem[]>(() => [
    { id: 1, name: t("regions.europe"), filter: "eu", image: { path: "/images/buyEsimPage/region/1.svg", alt: t("regions.europe") } },
    { id: 2, name: t("regions.southAmerica"), filter: "sa", image: { path: "/images/buyEsimPage/region/2.svg", alt: t("regions.southAmerica") } },
    { id: 3, name: t("regions.northAmerica"), filter: "na", image: { path: "/images/buyEsimPage/region/3.svg", alt: t("regions.northAmerica") } },
    { id: 4, name: t("regions.africa"), filter: "af", image: { path: "/images/buyEsimPage/region/4.svg", alt: t("regions.africa") } },
    { id: 5, name: t("regions.asia"), filter: "as", image: { path: "/images/buyEsimPage/region/5.svg", alt: t("regions.asia") } },
    { id: 6, name: t("regions.caribbean"), filter: "ca", image: { path: "/images/buyEsimPage/region/6.svg", alt: t("regions.caribbean") } },
  ], [t]);

  const globalItems = useMemo<GlobalItem[]>(() => [
    { id: 1, name: t("global.1gb"), filter: "1gb", image: { path: "/images/buyEsimPage/global/1.svg", alt: t("global.1gb") } },
    { id: 2, name: t("global.3gb"), filter: "3gb", image: { path: "/images/buyEsimPage/global/2.svg", alt: t("global.3gb") } },
    { id: 3, name: t("global.5gb"), filter: "5gb", image: { path: "/images/buyEsimPage/global/3.svg", alt: t("global.5gb") } },
    { id: 4, name: t("global.10gb"), filter: "10gb", image: { path: "/images/buyEsimPage/global/4.svg", alt: t("global.10gb") } },
    { id: 5, name: t("global.20gb"), filter: "20gb", image: { path: "/images/buyEsimPage/global/5.svg", alt: t("global.20gb") } },
  ], [t]);

  // Загрузка данных
  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => {
        const countries = Object.entries(data).map(([code, name], index) => ({
          id: index + 1,
          code,
          name: name as string,
          image: {
            path: `/images/flags/${code}.png`,
            alt: name as string,
          },
        }));
        setLocalCountries(countries);
      })
      .catch((error) => console.error("Ошибка загрузки стран:", error));

    fetch("/countryPackages.json")
      .then((res) => res.json())
      .then((data: PackageItem[]) => {
        setCountryPackages(data);
      })
      .catch((error) => console.error("Ошибка загрузки countryPackages:", error));

    fetch("/regionalPackages.json")
      .then((res) => res.json())
      .then((data: PackageItem[]) => {
        setRegionalPackages(data);
      })
      .catch((error) => console.error("Ошибка загрузки regionalPackages:", error));

    fetch("/globalPackages.json")
      .then((res) => res.json())
      .then((data: PackageItem[]) => {
        setGlobalPackages(data);
      })
      .catch((error) => console.error("Ошибка загрузки globalPackages:", error));
  }, []);

  // Фильтрация локальных стран
  useEffect(() => {
    if (localCountries.length && countryPackages.length) {
      const availableCodes = new Set(
        countryPackages.map((pkg) => pkg.location.toLowerCase())
      );
      const filteredLocal = localCountries.filter((country) =>
        availableCodes.has(country.code.toLowerCase())
      );
      setAvailableLocal(filteredLocal);
    }
  }, [localCountries, countryPackages]);

  // Фильтрация региональных пакетов
  useEffect(() => {
    if (regionalPackages.length) {
      const filteredRegional = regionalItems.filter((region) =>
        regionalPackages.some((pkg) => pkg.slug.toLowerCase().startsWith(region.filter))
      );
      setAvailableRegional(filteredRegional);
    }
  }, [regionalPackages, regionalItems]);

  // Фильтрация глобальных пакетов
  useEffect(() => {
    if (globalPackages.length) {
      const filteredGlobal = globalItems.filter((globalItem) =>
        globalPackages.some((pkg) => pkg.name.toLowerCase().includes(globalItem.filter))
      );
      setAvailableGlobal(filteredGlobal);
    }
  }, [globalPackages, globalItems]);

  useEffect(() => {
    const storedType = localStorage.getItem("selectedType") as "Local" | "Regional" | "Global" | null;
    if (storedType) {
      setType(storedType);
    }
  }, []);

  const categories: {
    Local: CountryItem[];
    Regional: RegionalItem[];
    Global: GlobalItem[];
  } = {
    Local: availableLocal,
    Regional: availableRegional,
    Global: availableGlobal,
  };

  const filteredItems = categories[type].filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // Если тип Local и список не развёрнут, показываем только первые 10 элементов
  const itemsToDisplay = type === "Local" && !showAll ? filteredItems.slice(0, 10) : filteredItems;

  return (
    <div className="pt-6 flex flex-col items-center mb-18 bg-[# ] h-full">
      <h2 className="text-2xl font-bold text-white">{t("title")}</h2>

      <div className="bg-bglight w-full max-w-md h-14 rounded-lg flex items-center justify-center mt-2">
      {(["Local", "Regional", "Global"] as const).map((item) => (
        <motion.div
          key={item}
          className={`cursor-pointer w-1/3 h-10 flex justify-center items-center rounded-md text-lg font-semibold transition-colors ${
            type === item
              ? "bg-gradient-to-r from-[#27A6E1] to-[#4381EB] text-white"
              : "text-gray-400"
          }`}
          onClick={() => {
            setType(item); // сохраняем английский ключ
            setShowAll(false);
            localStorage.setItem("selectedType", item);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {t(`types.${item}`)} {/* локализованная надпись */}
        </motion.div>
      ))}
      </div>
      <p className="mt-[24px] text-white">
        {type === "Local"
          ? t("Select a Country")
          : type === "Regional"
          ? t("Select a Region")
          : t("Select a Global eSim Package")}
      </p>

      <div className="mt-6 w-full max-w-md">
        { type === "Local" ? 
        <input
        type="text"
        placeholder={t("Search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg bg-bglight text-white px-4 py-2 border border-gray-700 focus:border-blue-500 outline-none"
      />
        : ""
        }
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex flex-col gap-4 w-full max-w-md"
        >
          {itemsToDisplay.map((item) => {
            const slug =
              type === "Local" && "code" in item
                ? item.code.toLowerCase()
                : "filter" in item
                ? item.filter
                : "unknown";
            return (
              <Link key={item.id} href={`/buyEsim/${type.toLowerCase()}/${slug}`}>
                <motion.div
                  className="bg-bglight px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image src={item.image.path} width={32} height={32} alt={item.image.alt} className="w-[32px] h-[32px]"/>
                  <h4 className="text-white text-lg">{item.name}</h4>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Кнопка для показа/скрытия дополнительных стран (только для Local) */}
      {type === "Local" && filteredItems.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-white text-[20px] font-semibold cursor-pointer"
          >
            {showAll ? t("Show less") : t("Show more")}
          </button>
        </div>
      )}
    </div>
  );
}
