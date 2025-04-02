'use client'
import { useState, useEffect } from 'react';
import { PricingCard } from "@/components/PricingCard";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'next/navigation';
import 'swiper/css';

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
  const { type, slug } = useParams() as { type: string; slug: string };
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const [packagesData, setPackagesData] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Функция для преобразования объёма в гигабайты (с округлением и минимумом 0.5GB)
  const convertVolumeToGB = (volume: number) => {
    let volumeGB = volume / (1024 * 1024 * 1024);
    volumeGB = volumeGB < 0.5 ? 0.5 : Math.ceil(volumeGB);
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
            .filter(pkg => {
              const volumeGB = Math.ceil(pkg.volume / (1024 * 1024 * 1024));
              return volumeGB === targetVolume;
            })
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

  return (
    <div className="container mx-auto p-4 bg-mainbg">
      <div className="flex items-center text-center gap-1">
        <Link href="/buyEsim" className="text-blue-500 underline object-contain">
          <Image
            src="/images/buyEsimPage/arrowL.svg"
            width={14}
            height={24}
            alt="arrow left"
            className="object-contain"
          />
        </Link>
        {displayType === 'Global' ? 
          <h1 className="text-[16px] font-bold">
            {slug.replace(/-/g, " ")}
          </h1>
        : 
          <h1 className="text-[16px] font-bold">
            Available Packages for {slug.replace(/-/g, " ")}
          </h1>
        }
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="text-white">Loading packages...</p>
        ) : (
          <div className="flex flex-col items-center space-y-6 bg-mainbg min-h-screen p-6">
            {packagesData.length > 0 ? (
              <>
                <PricingCard
                  name={packagesData[0].name}
                  description={packagesData[0].description}
                  price={packagesData[0].price}
                  data={packagesData[0].volumeGB || `${packagesData[0].volume}`}
                  duration={`${packagesData[0].duration} ${packagesData[0].durationUnit}`}
                  supportTopUpType={packagesData[0].supportTopUpType}
                  locations={packagesData[0].locationNetworkList.map((network) => network.locationName)}
                />
                <h2 className="text-lg text-white font-semibold">All tariffs</h2>
                <div className="w-full max-w-5xl">
                  <Swiper spaceBetween={20} slidesPerView={1}>
                    {packagesData.map((pkg, index) => (
                      <SwiperSlide key={index}>
                        <PricingCard
                          name={pkg.name}
                          description={pkg.description}
                          price={pkg.price}
                          data={pkg.volumeGB || `${pkg.volume}`}
                          duration={`${pkg.duration} ${pkg.durationUnit}`}
                          supportTopUpType={pkg.supportTopUpType}
                          locations={pkg.locationNetworkList.map((network) => network.locationName)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            ) : (
              <p className="text-white">No packages available for {slug}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
