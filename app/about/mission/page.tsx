"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function Mission() {
  const { language } = useLanguage();

  // ข้อความแปลต่างๆ
  const translations = {
    title: {
      th: "เราเกิดมาเพื่ออะไร และอะไรคือเป้าหมายของเรา",
      en: "Why We Exist and What is Our Goal"
    },
    mission: {
      title: {
        th: "Mission",
        en: "Mission"
      },
      content: {
        th: "ขององค์กร สคล.(เราเกิดมาเพื่อสิ่งนี้) : มุ่งมั่นในการริเริ่ม พัฒนา พาทํา สนับสนุน เอื้ออํานวย การทํางานของสมาชิก (Member centric)",
        en: "Of the Stop Drinking Network Organization (We exist for this): Committed to initiating, developing, leading, supporting, and facilitating the work of members (Member centric)"
      }
    },
    vision: {
      title: {
        th: "Vision",
        en: "Vision"
      },
      content: {
        th: "เป็นองค์กรภาคประชาสังคม ที่มีฐานเครือข่ายเข้มแข็ง สมาชิกเครือข่ายเป็นเสาหลักแก้ปัญหาในพื้นที่ เป็นที่ยอมรับ และมุ่งมั่นทําประโยชน์เพื่อส่วนรวมอย่างจริงจัง ไม่ย่อท้อ และมีความสุข",
        en: "To be a civil society organization with a strong network base. Network members are the pillars in solving local problems, are well-respected, and are committed to earnestly serving the common good without giving up, while maintaining happiness"
      }
    },
    slogan: {
      title: {
        th: "Slogan",
        en: "Slogan"
      },
      main: {
        th: "\"พลังเครือข่าย สานสุขทั่วไทย ปลอดภัยปลอดเหล้า\"",
        en: "\"Network Power, Weaving Happiness Throughout Thailand, Safe and Alcohol-Free\""
      },
      explanation: [
        {
          th: "\"พลังเครือข่าย คือ สมาชิกเครือข่ายงดเหล้าทั่วประเทศทุกระดับ ทุกประเภท ทุกเพศ ทุกวัย ที่มีความเข้มแข็ง มีความเป็นเจ้าของปัญหามุ่งมั่นที่จะแก้ปัญหาในพื้นที่ของตนเอง\"",
          en: "\"Network Power refers to members of the Stop Drinking Network across the country at all levels, of all types, genders, and ages, who are strong, who own the problem, and are determined to solve problems in their own areas\""
        },
        {
          th: "\"และขยายสมาชิกและพื้นที่งานออกไปอย่างกว้างขวาง ประสานความร่วมมือกับหน่วยงาน องค์กรต่างๆ จนเกิดมีความสําเร็จเล็กๆ สะสมจนขยับเป็นความสําเร็จที่ใหญ่ขึ้น ทั้งด้าน ลดปัจจัยเสี่ยง เพิ่มปัจจัยสร้าง ในหลากหลายบริบท\"",
          en: "\"And to expand membership and work areas extensively, coordinate with agencies and organizations until small successes accumulate and grow into bigger successes, both in reducing risk factors and increasing creative factors in various contexts\""
        },
        {
          th: "\"สานสุขทั่วไทยปลอดภัยปลอดเหล้า คือ ผลความสําเร็จของการทํางานของ พลังเครือข่าย ซึ่งเป็นผลรวมจากความพยายามร่วมกันของสมาชิกเครือข่าย หน่วยงาน และองค์กรต่างๆ ที่มีเจตนารมย์การทํางานร่วมกัน\"",
          en: "\"Weaving Happiness Throughout Thailand, Safe and Alcohol-Free is the result of the Network Power's work, which is the sum of collaborative efforts from network members, agencies, and organizations that share common working intentions\""
        }
      ]
    }
  };

  return (
    <div className="p-8 bg-Amber-100 pt-24"> 
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/logoสคล.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-8"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translations.title[language as keyof typeof translations.title]}
            </h1>
            <div className="h-1 w-24 bg-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-medium text-orange-500">
              {translations.mission.title[language as keyof typeof translations.mission.title]}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {translations.mission.content[language as keyof typeof translations.mission.content]}
            </p>
          </section>

          {/* Vision Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-medium text-orange-500">
              {translations.vision.title[language as keyof typeof translations.vision.title]}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {translations.vision.content[language as keyof typeof translations.vision.content]}
            </p>
          </section>

          {/* Slogan Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-medium text-orange-500">
              {translations.slogan.title[language as keyof typeof translations.slogan.title]}
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <p className="text-lg text-orange-700 font-medium text-center italic">
                {translations.slogan.main[language as keyof typeof translations.slogan.main]}
              </p>
            </div>
            <div className="mt-6 text-gray-600 leading-relaxed space-y-4">
              {translations.slogan.explanation.map((paragraph, index) => (
                <p key={index}>
                  {paragraph[language as keyof typeof paragraph]}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}