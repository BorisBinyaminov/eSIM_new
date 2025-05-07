'use client'
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface EsimData {
  iccid: string;
  data: {
    packageName?: string;
    esimStatus?: string;
    orderUsage?: number;
    expiredTime?: string;
    totalVolume?: number;
  };
}

const MySims = () => {
  const [sims, setSims] = useState<EsimData[]>([]);
  const t = useTranslations("myeSim");

  useEffect(() => {
    const fetchEsims = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/my-esims`, {
          headers: {
            'X-User-ID': window.localStorage.getItem("user_id") || "",  // Adjust based on your AuthProvider logic
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
        {sims.map((sim, index) => (
          <motion.div
            key={sim.iccid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 border border-gray-700 rounded-xl bg-bglight shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {sim.data.packageName || `eSIM #${index + 1}`}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  sim.data.esimStatus === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {sim.data.esimStatus || 'Unknown'}
              </span>
            </div>
            <div className="space-y-2 text-gray-300">
              <p><strong>{t("usage")}</strong> {formatUsage(sim.data.orderUsage)}</p>
              <p><strong>{t("order")}</strong> –</p> {/* Replace with actual order date if stored */}
              <p><strong>{t("expired")}</strong> {formatDate(sim.data.expiredTime)}</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-center w-full max-w-[85px]"
              >
                <button className="max-w-[85px] w-full px-4 py-2 border-[#27A6E1] border-[1px] rounded-[16px] transition">
                  {t("cancel")}
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-center w-full max-w-[328px]"
              >
                <div
                  className="w-full max-w-[328px] block bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] py-[10px] text-[16px] font-bold text-white"
                >
                  {t("top-up")}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
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
