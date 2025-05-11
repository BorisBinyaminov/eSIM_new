'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { FaDatabase, FaClock, FaRegCalendarAlt } from 'react-icons/fa';

interface EsimData {
  iccid: string;
  data: Record<string, any>;
}

const sortEsimsPriority = (esims: EsimData[]): EsimData[] => {
  const getPriority = (entry: EsimData) => {
    const status = entry.data?.esimStatus || "";
    const smdp = entry.data?.smdpStatus || "";
    if (smdp === "RELEASED" && status === "GOT_RESOURCE") return 0;
    if (smdp === "ENABLED" && status === "IN_USE") return 1;
    if (smdp === "ENABLED" && status === "GOT_RESOURCE") return 2;
    if (status === "USED_UP") return 3;
    if (status === "DELETED") return 4;
    return 5;
  };
  return [...esims].sort((a, b) => getPriority(b) - getPriority(a));
};

const MySims = () => {
  const [sims, setSims] = useState<EsimData[]>([]);
  const t = useTranslations("myeSim");

  const fetchEsims = async () => {
    const userId = JSON.parse(localStorage.getItem("telegram_user") || "{}")?.id;
    if (!userId) return;
    try {
      const res = await fetch("https://mini.torounlimitedvpn.com/esim/my-esims", {
        headers: { 'X-User-ID': String(userId) },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const sorted = sortEsimsPriority(json.data);
        setSims(sorted);
      }
    } catch (err) {
      console.error("Error fetching eSIMs", err);
    }
  };

  useEffect(() => {
    fetchEsims();
  }, []);

  const canCancel = (statusLabel: string) => ["New", "Onboard"].includes(statusLabel);

  const canTopUp = (data: any) => {
    const supportTopUp = data.packageList?.[0]?.supportTopUpType === 2;
    const smdp = data.smdpStatus;
    const status = data.esimStatus;
  
    console.log("🔍 Top-Up Check", {
      iccid: data.iccid,
      supportTopUpType: data.packageList?.[0]?.supportTopUpType,
      smdp,
      status,
      canTopUp: supportTopUp &&
        ["RELEASED", "ENABLED"].includes(smdp) &&
        ["GOT_RESOURCE", "IN_USE"].includes(status)
    });
  
    return (
      supportTopUp &&
      ["RELEASED", "ENABLED"].includes(smdp) &&
      ["GOT_RESOURCE", "IN_USE"].includes(status)
    );
  };
  
  const canRefresh = (statusLabel: string) => statusLabel === "In Use";

  const canDelete = (statusLabel: string) => !["New", "Onboard", "In Use"].includes(statusLabel);

  const getStatusLabel = (smdp: string, status: string) => {
    if (smdp === "RELEASED" && status === "GOT_RESOURCE") return "New";
    if (smdp === "ENABLED" && status === "IN_USE") return "In Use";
    if (smdp === "ENABLED" && status === "GOT_RESOURCE") return "Onboard";
    if (status === "USED_UP") return "Depleted";
    if (status === "DELETED") return "Deleted";
    return "Inactive";
  };

  const handleAction = async (action: string, sim: EsimData) => {
    let prompt = `Are you sure you want to ${action} this eSIM?`;
    if (action === "delete") {
      prompt = `⚠️ This will permanently delete the eSIM from the database and cannot be undone. Continue?`;
    }
    const userConfirmed = confirm(prompt);
    if (!userConfirmed) return;

    const userId = JSON.parse(localStorage.getItem("telegram_user") || "{}")?.id;
    if (!userId) return;

    try {
      if (action === "cancel") {
        const payload = { iccid: sim.iccid, tran_no: sim.data.esimTranNo };
        await fetch("https://mini.torounlimitedvpn.com/esim/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("✅ eSIM cancellation requested.");
      } else if (action === "delete") {
        const payload = { iccid: sim.iccid };
        await fetch("https://mini.torounlimitedvpn.com/esim/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("🗑 eSIM deleted successfully.");
      } else if (action === "refresh") {
        alert("🔄 Refreshing usage...");
      } else if (action === "topup") {
        alert("💳 Top-up logic will display available packages in next step.");
      }

      await fetchEsims();
    } catch (err) {
      console.error(`${action} failed`, err);
      alert(`❌ ${action} failed. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#05081A] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="space-y-6">
        {sims.map((sim, index) => {
          const status = sim.data.esimStatus;
          const smdp = sim.data.smdpStatus;
          const statusLabel = getStatusLabel(smdp, status);
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
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-white/60 mb-1">{t("packageName")}</div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    statusLabel === 'In Use' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {t(statusLabel.toLowerCase().replace(/ /g, "-") as any)}
                </span>
              </div>
              <div className="text-xl font-bold text-white mb-4">{packageName}</div>

              <div className="flex flex-wrap gap-3 mb-4">
                {canCancel(statusLabel) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-white rounded-[16px] text-white"
                    onClick={() => handleAction("cancel", sim)}
                  >
                    {t("cancel")}
                  </motion.button>
                )}

                {canTopUp(sim.data) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#27A6E1] to-[#4381EB] rounded-[16px] px-4 py-2 text-center font-bold text-white"
                    onClick={() => handleAction("topup", sim)}
                  >
                    {t("top-up")}
                  </motion.button>
                )}

                {canRefresh(statusLabel) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-yellow-500 text-yellow-300 rounded-[16px]"
                    onClick={() => handleAction("refresh", sim)}
                  >
                    🔄 {t("refresh")}
                  </motion.button>
                )}

                {canDelete(statusLabel) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-red-500 text-red-400 rounded-[16px]"
                    onClick={() => handleAction("delete", sim)}
                  >
                    🗑 {t("delete")}
                  </motion.button>
                )}
              </div>

              <div className="bg-[#0B1434] p-4 rounded-xl space-y-3 text-sm text-white/80">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaDatabase className="text-white/50" />
                    <span>{t("usage")}</span>
                  </div>
                  <span>{formatUsage(sim.data.orderUsage)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt className="text-white/50" />
                    <span>{t("order")}</span>
                  </div>
                  <span>{formatDate(orderDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-white/50" />
                    <span>{t("expired")}</span>
                  </div>
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
