'use client'
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function Project2567() {
  const { language } = useLanguage();

  // ข้อความแปลต่างๆ
  const translations = {
    title: {
      th: "โครงการที่ดำเนินงานประจำปี 2567",
      en: "Projects for Fiscal Year 2024"
    },
    projects: [
      {
        th: "งานบุญประเพณีท่องเที่ยวปลอดเหล้าปลอดภัย",
        en: "Alcohol-Free and Safe Traditional Festivals and Tourism"
      },
      {
        th: "ชุมชนคนสู้เหล้า, ชุมชนช่วยเลิก, ชรมคนหัวใจเพชร",
        en: "Communities Fighting Alcohol, Community-Assisted Quitting, Diamond Heart Club"
      },
      {
        th: "การสนับสนุนการบังคับใช้กฎหมายและนโยบาย",
        en: "Supporting Law Enforcement and Policy Implementation"
      },
      {
        th: "งานพัฒนาศักยภาพประชาคมงดเหล้าจังหวัดและอำเภอบูรณาการ",
        en: "Developing Capacity for Provincial and District Alcohol Abstinence Communities"
      },
      {
        th: "งานโพธิ์สัตว์น้อยลูกขอพ่อแม่เลิกเหล้า",
        en: "Little Bodhisattva: Children Ask Parents to Quit Alcohol"
      },
      {
        th: "ชุมชนท่องเที่ยวปลอดภัย",
        en: "Safe Tourism Communities"
      },
      {
        th: "ปลูกพลังบวกปฐมวัยหนูน้อยใจเข็มแข็ง",
        en: "Building Positive Energy in Early Childhood Development"
      },
      {
        th: "งานบวชสร้างสุขและเครือข่ายสังฆะเพื่อสังคม",
        en: "Ordination for Happiness and Sangha Network for Society"
      },
      {
        th: "เครือข่ายเยาวชน YSDN (Young stronge and development network)",
        en: "YSDN (Young Strong and Development Network) Youth Network"
      },
      {
        th: "งานพัฒนานโยบายสาธารณะเพื่อควบคุมปัจจัยเสี่ยง",
        en: "Public Policy Development for Risk Factor Control"
      },
      {
        th: "งานโรงเรียนคำพ่อสอน ครูดีไม่มีอบายมุข",
        en: "Father's Teaching Schools and Good Teachers Without Vices"
      },
      {
        th: "งานพื้นที่และกิจกรรมสร้างสรรค์สำหรับเด็กเยาวชน",
        en: "Creative Spaces and Activities for Children and Youth"
      },
      {
        th: "SDN Futsal No-L Club",
        en: "SDN Futsal No-L Club"
      },
      {
        th: "กีฬา ดนตรี ศิลปะวัฒนธรรม จิตอาสาสำหรับเยาวชน",
        en: "Sports, Music, Arts, Culture, and Volunteering for Youth"
      },
      {
        th: "งานเทศกาลอาหารปลอดภัย อร่อยได้ไร้แอลกอฮอล์และเครือข่ายผู้ประกอบการฯ",
        en: "Safe Food Festivals: Delicious Without Alcohol and Entrepreneur Network"
      },
      {
        th: "งานพัฒนาสื่อสร้างสรรค์เพื่อสุขภาวะ",
        en: "Development of Creative Media for Well-being"
      },
      {
        th: "งานเครือข่ายความร่วมมือระหว่างประเทศ Movendi International",
        en: "International Cooperation Network with Movendi International"
      }
    ]
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 py-6 bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center bg-orange-400 p-4 rounded-lg text-white mb-6">
          {translations.title[language as keyof typeof translations.title]}
        </h2>
        <ul className="space-y-4">
          {translations.projects.map((project, index) => (
            <li key={index} className="flex items-center text-lg">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                index % 2 === 0 ? 'bg-orange-400' : 'bg-orange-200'
              } text-white mr-2`}>
                {index + 1}
              </div>
              {project[language as keyof typeof project]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}