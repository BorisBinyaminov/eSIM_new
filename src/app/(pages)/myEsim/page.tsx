'use client'
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface DisplayEsim {
  id: number;
  name: string;
  status: 'Active' | 'Disactive';
  usage: string;
  orderDate: string;
  expiryDate: string;
}

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
  const [sims, setSims] = useState<DisplayEsim[]>([]);
  const t = useTranslations("myeSim");

  useEffect(() => {
    const fetchEsims = async () => {
      const userId = JSON.parse(localStorage.getItem("telegram_user") || "{}")?.id;
      if (!userId) return;

      try {
        const res = await fetch("https://mini.torounlimitedvpn.com/my-esims", {
          headers: { 'X-User-ID': String(userId) },
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const parsed: DisplayEsim[] = json.data.map((sim: EsimData, i: number): DisplayEsim => {
            const pkg = sim.data.packageList?.[0];
            return {
              id: i + 1,
              name: pkg?.packageName || `eSIM #${i + 1}`,
              status: sim.data.esimStatus === 'ACTIVE' ? 'Active' : 'Disactive',
              usage: formatUsage(sim.data.orderUsage),
              orderDate: formatDate(pkg?.createTime),
              expiryDate: formatDate(sim.data.expiredTime),
            };
          });

          parsed.sort((a: DisplayEsim, b: DisplayEsim) => (a.status === 'Active' ? -1 : 1));
          setSims(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch eSIMs", err);
      }
    };

    fetchEsims();
  }, []);

  return (
    <div className="min-h-screen bg-[#05081A] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="space-y-6">
        {sims.map((sim) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 border border-gray-700 rounded-xl bg-bglight shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{sim.name}</h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  sim.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {sim.status}
              </span>
            </div>
            <div className="space-y-2 text-gray-300">
              <p><strong>{t("usage")}</strong> {sim.usage}</p>
              <p><strong>{t("order")}</strong> {sim.orderDate}</p>
              <p><strong>{t("expired")}</strong> {sim.expiryDate}</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-center w-full max-w-[85px]"
              >
                <button className="max-w-[85px] w-full px-4 py-2 border-[#27A6E1] border-[1px] rounded-[16px] transition">{t("cancel")}</button>
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