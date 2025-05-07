'use client'
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface EsimData {
  iccid: string;
  data: {
    esimStatus?: string;
    orderUsage?: number;
    expiredTime?: string;
    packageList?: {
      packageName?: string;
      createTime?: string;
    }[];
  };
}

const MySims = () => {
  const [sims, setSims] = useState<EsimData[]>([]);
  const t = useTranslations("myeSim");

  useEffect(() => {
    const fetchEsims = async () => {
      const userId = JSON.parse(localStorage.getItem("telegram_user") || "{}")?.id;

      if (!userId) {
        console.warn("❌ No user ID found in Telegram WebApp initData");
        return;
      }

      try {
        const res = await fetch("https://mini.torounlimitedvpn.com/my-esims", {
          headers: {
            'X-User-ID': String(userId),
          }
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSims(json.data);
        } else {
          console.error("Failed to fetch eSIMs", json.error);
        }
      } catch (err) {
        console.error("Error fetching eSIMs", err);
      }
    };

    fetchEsims();
  }, []);

  return (
    <div className="min-h-screen bg-[#05081A] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="space-y-6">
        {sims.map((sim, index) => {
          const status = sim.data.esimStatus;
          const packageName = sim.data.packageList?.[0]?.packageName || `eSIM #${index + 1}`;
          const orderDate = sim.data.packageList?.[0]?.createTime;
          const expiredTime = sim.data.expiredTime;

          return (
            <motion.div
              key={sim.iccid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 border border-[#305BFF] rounded-xl bg-[#10193F] shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-[16px] font-semibold text-white">
                  {t("packageName")}
                  <div className="text-xl font-bold">{packageName}</div>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status === 'ACTIVE' ? t("active") : t("inactive")}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3 mb-4">
                <button className="w-[85px] px-4 py-2 border border-white rounded-[16px] text-white">
                  {t("cancel")}
                </button>
                <div className="w-full bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-2 text-center font-bold text-white">
                  {t("top-up")}
                </div>
              </div>

              <div className="bg-[#0B1434] p-4 rounded-xl space-y-3 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>{t("usage")}</span>
                  <span>{formatUsage(sim.data.orderUsage)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("order")}</span>
                  <span>{formatDate(orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("expired")}</span>
                  <span>{formatDate(expiredTime)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

function formatUsage(bytes?: number): string {
  if (!bytes) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default MySims;
