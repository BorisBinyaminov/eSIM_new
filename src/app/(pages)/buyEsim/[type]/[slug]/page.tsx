'use client'
import { useState, useEffect } from 'react';
import { PricingCard } from "@/components/PricingCard";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'next/navigation';
import 'swiper/css';
import { useTranslations } from 'next-intl';
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { usePurchaseStore } from '@/store/usePurchaseStore'
import { useRouter } from 'next/navigation'


interface Operator {
  operatorName: string;
  networkType: string;
}

interface LocationNetwork {
  locationName: string;
  locationLogo: string;
  locationCode: string;
  operatorList: Operator[];
}

interface Package {
  packageCode: string;
  slug: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  smsStatus: number;
  dataType: number;
  unusedValidTime: number;
  duration: number;
  durationUnit: string;
  location: string;
  description: string;
  activeType: number;
  favorite: boolean;
  retailPrice: number;
  speed: string;
  ipExport: string;
  supportTopUpType: number;
  fupPolicy: string;
  locationNetworkList: LocationNetwork[];
  // Дополнительное поле для отформатированного объёма (для local)
  volumeGB?: string;
}

export default function CountryPage() {
  const t = useTranslations("buyeSim");
  const { type, slug } = useParams() as { type: string; slug: string };
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const [packagesData, setPackagesData] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter()
  const setSelectedPackage = usePurchaseStore(state => state.setSelectedPackage)


  if (authLoading) return <div className="text-white text-center mt-10"> {t('common.authorizing')}</div>;
  if (!user) return <div className="text-white text-center mt-10">{t('common.userNotFound')}</div>;

  // Функция для преобразования объёма в гигабайты (с округлением и минимумом 0.5GB)
  const convertVolumeToGB = (volume: number) => {
    let volumeGB = volume / (1024 * 1024 * 1024);
    volumeGB = Math.ceil(volumeGB * 10) / 10;
    return volumeGB;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: Package[] = [];
        if (type === 'local') {
          const res = await fetch('/countryPackages.json');
          data = await res.json();
          data = data
            .filter(pkg => pkg.location.toLowerCase() === slug.toLowerCase())
            .map(pkg => ({
              ...pkg,
              volumeGB: convertVolumeToGB(pkg.volume) + "GB"
            }))
            .sort((a, b) => a.retailPrice - b.retailPrice);
        } else if (type === 'regional') {
          const res = await fetch('/regionalPackages.json');
          data = await res.json();
          data = data
            .filter(pkg => pkg.slug.toLowerCase().startsWith(slug))
            .map(pkg => ({
              ...pkg,
              volumeGB: convertVolumeToGB(pkg.volume) + "GB"
            }))
            .sort((a, b) => a.retailPrice - b.retailPrice);
        } else if (type === 'global') {
          const res = await fetch('/globalPackages.json');
          data = await res.json();
          const packageMapping: Record<string, number> = {
            "1gb": 1,
            "3gb": 3,
            "5gb": 5,
            "10gb": 10,
            "20gb": 20,
          };
          const targetVolume = packageMapping[slug.toLowerCase()];
          data = data
            .map(pkg => ({
              ...pkg,
              volumeGBNumeric: convertVolumeToGB(pkg.volume), // для фильтра
              volumeGB: convertVolumeToGB(pkg.volume) + "GB" // для отображения
            }))
            .filter(pkg => pkg.volumeGBNumeric === targetVolume)
            .sort((a, b) => a.retailPrice - b.retailPrice);
        }
  
        setPackagesData(data);
      } catch (error) {
        console.error("Error fetching package data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    const interval = setInterval(() => fetchData(), 7200000);
    return () => clearInterval(interval);
  }, [type, slug]);

  const handleBuyNow = async (pkg: any) => {
  let count = 1
  let period_num: number

  if (pkg.duration === 1) {
    const daysStr = window.prompt("How many days?", "1")
    if (daysStr === null) return
    const days = parseInt(daysStr, 10)
    period_num = isNaN(days) || days < 1 ? 1 : days
  } else {
    period_num = 1
  }

  setSelectedPackage({ ...pkg, count, period_num })
  router.push('/paymentMethod')
}
  return (
    <div className="container mx-auto p-4 bg-mainbg">
      <div className="flex items-center text-center gap-1">
        <Link href="/buyEsim" className="text-blue-500 underline object-contain">
          <Image
            src="/images/buyEsimPage/arrowL.svg"
            width={14}
            height={24}
            alt="arrow left"
            className="object-contain h-[24px] w-[14px]"
          />
        </Link>
        {displayType === 'Global' ? 
          <h1 className="text-[16px] font-bold text-white">
            {slug.replace(/-/g, " ")}
          </h1>
        : 
          <h1 className="text-[16px] font-bold text-white">
            {t("Available Packages for")} {loading ? t('common.loading') : packagesData[0].name.split(/[\s(]/)[0]}
          </h1>
        }
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="text-white">{t('common.loadingPackages')}</p>
        ) : (
          <div className="flex flex-col items-center space-y-6 bg-mainbg min-h-screen p-6">
            {packagesData.length > 0 ? (
              <>
                <PricingCard
                  name={packagesData[0].name}
                  description={packagesData[0].description}
                  price={packagesData[0].retailPrice}
                  data={packagesData[0].volumeGB || `${packagesData[0].volume}`}
                  duration={`${packagesData[0].duration} ${packagesData[0].durationUnit}`}
                  supportTopUpType={packagesData[0].supportTopUpType}
                  locations={packagesData[0].locationNetworkList.map((network) => network.locationName)}
                  type={type}
                  coverage={packagesData[0].locationNetworkList.map((network) => network.locationName).length}
                  onBuy={() => handleBuyNow(packagesData[0])}
                />
                <h2 className="text-lg text-white font-semibold">{t("All tariffs")}</h2>
                <div className="w-full max-w-5xl overflow-hidden px-4">
                  <Swiper 
                    spaceBetween={10} 
                    slidesPerView={1.2}
                    grabCursor={true} 
                    breakpoints={{
                      640: {
                        slidesPerView: 1.5,
                      },
                      768: {
                        slidesPerView: 2.2,
                      },
                      1024: {
                        slidesPerView: 3.2,
                      },
                    }}
                  >
                    {packagesData.map((pkg, index) => (
                      <SwiperSlide key={index} className='w-full'>
                        <PricingCard
                          name={pkg.name}
                          description={pkg.description}
                          price={pkg.retailPrice}
                          data={pkg.volumeGB || `${pkg.volume}`}
                          duration={`${pkg.duration} ${pkg.durationUnit}`}
                          supportTopUpType={pkg.supportTopUpType}
                          locations={pkg.locationNetworkList.map((network) => network.locationName)}
                          coverage={pkg.locationNetworkList.map((network) => network.locationName).length}
                          onBuy={() => handleBuyNow(pkg)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            ) : (
              <p className="text-white"> {t('common.noPackages', { slug })}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}