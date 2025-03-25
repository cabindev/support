// app/about/principle/page.tsx
'use client';
import React from "react";
import Image from "next/image";
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function Principle() {
  const { language } = useLanguage();

  // ข้อความแปลต่างๆ
  const translations = {
    title: {
      th: "12 แนวคิดหลักของเครือข่ายงดเหล้า",
      en: "12 Basic Principles of Stop Drinking Network"
    },
    subtitle: {
      th: "(basic principles)",
      en: "(basic principles)"
    },
    footer: {
      th: "© สำนักงานเครือข่ายองค์กรงดเหล้า",
      en: "© Stop Drinking Network Organization"
    }
  };

  // หลักการ 12 ข้อในทั้งสองภาษา
  const principles = {
    th: [
      `คนดื่มแอลกอฮอล์ไม่ได้เป็นการตัดสินว่าเป็น "คนดี-คนไม่ดี" แต่พฤติกรรมการดื่มมีความเสี่ยงต่อตัวเขาเองและคนอื่น ทั้งนี้เราสามารถทํางานร่วมได้กับทุกคนและเชื่อมั่นว่าทุกคนที่มาทํางานร่วมกับเราแล้วเขาจะค่อยๆ ลดการดื่มลง`,
      "ธุรกิจที่ขายอย่างไม่รับผิดชอบ คือตัวแพร่กระจายต้นเหตุของปัญหา เป็นธุรกิจที่ไร้จริยธรรม ได้กําไรบนความทุกข์ของคน",
      "หน้าที่เราคือทําให้สังคมยอมรับว่า แอลกอฮอล์เป็นสินค้าที่สร้างปัญหา ต้องควบคุมไม่ใช่ปล่อยเสรี ไม่ใช่การห้ามขาย",
      "มีเหตุผลที่หนักแน่น คือ เพื่อประโยชน์ทางสาธารณสุข ความปลอดภัย วัฒนธรรม ประเพณีที่เหมาะสม และการคุ้มครองผู้บริโภค",
      "เชื่อมงานสุขภาพทุกมิติ ออกกําลังกาย อ้วน เบาหวาน ความดัน ไขมัน สิ่งแวดล้อม เศรษฐกิจ สังคม จากระดับชุมชนสู่ระดับโลก หรือ Alcohol in all policy โดยมีหลัก SDGs NCD Target และ Ottawa charter เป็นพื้นฐาน",
      "ใช้กระบวนการ 3 เหลี่ยมเขยื้อนภูเขา ประสานพลังภาคีเครือข่ายทุกภาคส่วน ใช้หลักปัญหาการดื่มโดยรวม ต้องแก้ไขไปพร้อมกันไม่ใช่แยกย่อยปัญหาแล้วแก้ไปทีละอย่าง",
      "ใช้งานความรู้ งานข้อมูลวิชาการ สถิติปัญหา หรือสถิติเปรียบเทียบเพื่อขยายผลเชิงนโยบาย โดยทํากิจกรรมเพื่อสรุปยกระดับ นําเสนอคืนข้อมูลแก่ฝ่ายนโยบายระดับ อําเภอ จังหวัด ภาค ประเทศ",
      `เข็มพิษที่จะทิ่มแทงหัวใจของธุรกิจแอลกอฮอล์และการตลาดของเขา คือ ปัญหาต่อคนรอบข้าง และต่อเด็กเยาวชน (ความรุนแรงในครอบครัว/ทะเลาะวิวาท/อุบัติเหตุ/ท้องไม่พร้อม/โรคเอดส์) โดยมีกองทุนช่วยเหลือผู้ได้รับผลกระทบจากน้ําเมาและเครือข่ายผู้ได้รับผลกระทบเป็นหนึ่งกลไก`,
      "ใช้ Key message เพื่อสร้างกระแสสาธารณะ ได้แก่ งานปลอดเหล้า สนุกได้ไร้แอลกอฮอล์ ของขวัญปลอดเหล้า สนุกได้ มันส์ได้ไร้แอลกอฮอล์ และเพื่อนกันมันส์โนเอล เป็นต้น",
      "มาตรการกฎหมาย เป็น Hard power ที่ต้องทําอย่างฉลาด ทําเป็นระบบ ใช้โอกาส จังหวะที่เหมาะสม เช่นเดียวกันกับมาตราการรณรงค์ ซึ่งเป็น Soft power ที่ทําเพื่อปรับเปลี่ยนทัศนคติและพฤติกรรมของผู้คนซึ่งต้องทําควบคู่กันได้",
      "กําลังนักรณรงค์คนเล็กคนน้อย กระจายอยู่ทุกหมู่บ้าน ทุกชุมชน ทุกหน่วยงาน องค์กร ทั่วประเทศ ดังนั้น ต้องสร้างนักรณรงค์เยาวชน ชมรมเยาวชน นักรณรงค์ชมรมคนหัวใจเพชร หรือจะเรียกชื่ออย่างไรก็แล้วแต่ เพราะนี่คือผู้นําการเปลี่ยนแปลงที่แท้จริง",
      "ชุมชนมีศักยภาพในการช่วยเหลือผู้ป่วยจากการดื่มสุรา เรียกว่า ชุมชนช่วยเลิก โดยประสานกับ รพ.สต. รพ.ชุมชน หรือ รพ.จังหวัด/ศูนย์ ได้"
    ],
    en: [
      "Alcohol drinkers should not be judged as 'good or bad people', but drinking behavior poses risks to themselves and others. We can work with everyone and believe that those who work with us will gradually reduce their drinking.",
      "Businesses that sell irresponsibly spread the root cause of problems. They are unethical businesses profiting from people's suffering.",
      "Our duty is to make society accept that alcohol is a product that creates problems and must be controlled, not liberalized, but not banned from sale.",
      "There are solid reasons for this: public health benefits, safety, appropriate culture and traditions, and consumer protection.",
      "Connect health work in all dimensions: exercise, obesity, diabetes, blood pressure, fat, environment, economy, society, from community to global level, or 'Alcohol in all policy' based on SDGs, NCD Targets, and Ottawa Charter principles.",
      "Use the 'Triangle that Moves the Mountain' process, coordinating the power of networks from all sectors. Apply the principle that overall drinking problems must be solved simultaneously, not by breaking down problems and solving them one by one.",
      "Use knowledge, academic information, problem statistics, or comparative statistics to expand policy results by conducting activities to summarize, elevate, and present information back to policy departments at district, provincial, regional, and national levels.",
      "The poisonous needle that will pierce the heart of the alcohol business and their marketing is the problems to those around drinkers and to children and youth (family violence/quarrels/accidents/unwanted pregnancy/AIDS). The fund to help those affected by alcohol and the network of affected people is one mechanism.",
      "Use key messages to create public trends, such as 'Alcohol-free events', 'Fun without alcohol', 'Alcohol-free gifts', 'Fun and excitement without alcohol', and 'Friends having fun with No-El', etc.",
      "Legal measures are 'Hard power' that must be implemented intelligently, systematically, using opportunities and appropriate timing. Similarly, campaign measures are 'Soft power' aimed at changing attitudes and behaviors of people, which must be done in parallel.",
      "The power of small campaigners spread across every village, community, department, and organization throughout the country. Therefore, we must create youth campaigners, youth clubs, diamond-hearted campaigner clubs, or whatever they may be called, because they are the true leaders of change.",
      "Communities have the potential to help patients suffering from alcohol consumption, called 'Community Helps Quit', by coordinating with health promotion hospitals, community hospitals, or provincial/central hospitals."
    ]
  };

  return (
    <div className="p-8 bg-Amber-100 pt-24"> 
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/logoสคล.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-8"
              priority
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-4 max-w-2xl mx-auto">
              {translations.title[language as keyof typeof translations.title]}
            </h1>
            <p className="text-gray-600 mb-4">{translations.subtitle[language as keyof typeof translations.subtitle]}</p>
            <div className="h-1 w-24 bg-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {principles[language as keyof typeof principles].map((principle, index) => (
                <div 
                  key={index} 
                  className="p-6 hover:bg-orange-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-medium text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {principle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              {translations.footer[language as keyof typeof translations.footer]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}