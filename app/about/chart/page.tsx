'use client'
import Image from "next/image";
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function Chart() {
  const { language } = useLanguage();

  // ข้อความแปลต่างๆ
  const translations = {
    title: {
      th: "โครงสร้างสำนักงานเครือข่ายองค์กรงดเหล้า ปี 2567",
      en: "Stop Drink Network Organization Structure 2024"
    },
    association: {
      title: {
        th: "สมาคมเครือข่ายงดเหล้าและงดปัจจัยเสี่ยงต่อสุขภาพ",
        en: "Association of Stop Drink Network and Health Risk Factors Abstinence"
      },
      president: {
        th: "นายกสมาคมฯ: นายธีระ วัชรปราณี",
        en: "Association President: Mr. Teera Watcharapranee"
      }
    },
    network: {
      title: {
        th: "เครือข่ายงดเหล้า (Stop Drink Network)",
        en: "Stop Drink Network"
      },
      chair: {
        th: "ประธานเครือข่าย: นายสงกรานต์ ภาคโชคดี",
        en: "Network Chairman: Mr. Songkran Pakchokdee"
      },
      members: {
        th: "สมาชิกอาสาสมัครทั่วประเทศ",
        en: "Volunteer members nationwide"
      }
    },
    office: {
      title: {
        th: "สำนักงานเครือข่ายองค์กรงดเหล้า",
        en: "Stop Drink Network Office"
      },
      director: {
        th: "ผู้อำนวยการสำนักงานฯ: นายธีระ วัชรปราณี",
        en: "Office Director: Mr. Teera Watcharapranee"
      }
    },
    assistant: {
      title: {
        th: "ผู้ช่วยผู้อำนวยการสำนักงานฯ",
        en: "Assistant Director"
      },
      name: {
        th: "นายชัยณรงค์ คำแดง",
        en: "Mr. Chainarong Kamdaeng"
      },
      department: {
        th: "กลุ่มงานด้านสำนักงาน จัดซื้อและคลังสื่อ",
        en: "Office, Procurement, and Media Warehouse Department"
      }
    },
    regional: {
      title: {
        th: "ผู้จัดการศูนย์ประสานงาน ระดับภูมิภาค 9 แห่ง",
        en: "Regional Coordination Center Managers (9 Regions)"
      },
      regions: [
        {
          th: "1. ภาคเหนือตอนบน 8 จังหวัด",
          en: "1. Upper Northern Region (8 provinces)"
        },
        {
          th: "2. ภาคเหนือตอนล่าง 10 จังหวัด",
          en: "2. Lower Northern Region (10 provinces)"
        },
        {
          th: "3. ภาคอีสานตอนบน 11 จังหวัด",
          en: "3. Upper Northeastern Region (11 provinces)"
        },
        {
          th: "4. ภาคอีสานตอนล่าง 9 จังหวัด",
          en: "4. Lower Northeastern Region (9 provinces)"
        },
        {
          th: "5. ภาคกลาง กทม. 9 จังหวัด",
          en: "5. Central Region and Bangkok (9 provinces)"
        },
        {
          th: "6. ภาคตะวันตก 8 จังหวัด",
          en: "6. Western Region (8 provinces)"
        },
        {
          th: "7. ภาคตะวันออก 8 จังหวัด",
          en: "7. Eastern Region (8 provinces)"
        },
        {
          th: "8. ภาคใต้ตอนบน 7 จังหวัด",
          en: "8. Upper Southern Region (7 provinces)"
        },
        {
          th: "9. ภาคใต้ตอนล่าง 7 จังหวัด",
          en: "9. Lower Southern Region (7 provinces)"
        }
      ]
    },
    central: {
      title: {
        th: "ผู้จัดการโครงการส่วนกลาง",
        en: "Central Project Managers"
      },
      staff: [
        {
          name: {
            th: "นายสุวรรณกิตต์ บุญแท้",
            en: "Mr. Suwannakitt Boontae"
          }
        },
        {
          name: {
            th: "นส.พิมพ์มณี เมฆพายัพ",
            en: "Ms. Pimmanee Mekphayap"
          }
        },
        {
          name: {
            th: "นายธิติ ภัทรสิทธิกฤต",
            en: "Mr. Thiti Pattarasitthikrit"
          }
        },
        {
          name: {
            th: "นส.อภิศา มะหะมาน",
            en: "Ms. Aphisa Mahaman"
          }
        },
        {
          name: {
            th: "นางมาลัย มินศรี",
            en: "Mrs. Malai Minsri"
          }
        },
        {
          name: {
            th: "นายวิษณุ ศรีทะวงศ์",
            en: "Mr. Wisanu Srithawong"
          }
        },
        {
          name: {
            th: "นส.ละออ นาสมบูรณ์",
            en: "Ms. La-or Nasomboon"
          }
        },
        {
          name: {
            th: "นางปุณนภา เอมวัฒนา",
            en: "Mrs. Punnapa Emwattana"
          }
        },
        {
          name: {
            th: "นส.สมรุจี สุขสม",
            en: "Ms. Somrujee Suksom"
          }
        },
        {
          name: {
            th: "นายธีร์ธรรม วุฒิวัตรชัยแก้ว",
            en: "Mr. Theertham Wutthiwatchaikaew"
          }
        }
      ]
    },
    communication: {
      title: {
        th: "กลุ่มสื่อสารและประชาสัมพันธ์",
        en: "Communications and Public Relations Group"
      },
      staff: [
        {
          name: {
            th: "นส.กนิษฐา ติ้ววงศ์",
            en: "Ms. Kanittha Tiwwong"
          }
        },
        {
          name: {
            th: "นายยงยุทธ ยอดจารย์",
            en: "Mr. Yongyuth Yodjarn"
          }
        }
      ]
    }
  };

  return (
    <div className="p-8 bg-Amber-100 pt-24"> 
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-400">
            {translations.title[language as keyof typeof translations.title]}
          </h1>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Image
              src="/images/sdn.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
      {/* แผนกหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* สมาคมเครือข่ายงดเหล้า... */}
        <div className="card bg-blue-200 shadow-2xl col-span-1 md:col-span-2">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/images/Teera.png"
                alt="นายธีระ วัชรปราณี"
                className="rounded-full h-28 w-28 object-cover"
              />
            </div>
            <p className="font-semibold">{translations.association.president[language as keyof typeof translations.association.president]}</p>
            <h2 className="card-title text-2xl mb-2 justify-center">
              {translations.association.title[language as keyof typeof translations.association.title]}
            </h2>
          </div>
        </div>

        {/* เครือข่ายงดเหล้า (Stop Drink Network) */}
        <div className="card bg-purple-200 shadow-xl col-span-1">
          <div className="card-body text-center">
            <div className="flex justify-center">
              <img
                src="/images/songran.jpg"
                alt="อาสงกรานต์"
                className="rounded-full h-28 w-28 object-cover"
              />
            </div>
            <p className="font-semibold">
              {translations.network.chair[language as keyof typeof translations.network.chair]}
            </p>
            <p>{translations.network.members[language as keyof typeof translations.network.members]}</p>
            <h2 className="card-title text-xl mb-2 justity-center">
              {translations.network.title[language as keyof typeof translations.network.title]}
            </h2>
          </div>
        </div>
      </div>
      {/* แผนกย่อย */}
      <div className="flex flex-col items-center my-6">
        <div className="text-center mb-4">
          {/* รูปภาพผู้อำนวยการสำนักงานฯ */}
          <h2 className="text-lg font-bold text-gray-800">
            {translations.office.title[language as keyof typeof translations.office.title]}
          </h2>
          <p className="text-lg text-gray-600">
            {translations.office.director[language as keyof typeof translations.office.director]}
          </p>
        </div>

        {/* ลูกศรชี้ไปยังแผนกย่อย */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500 mb-2 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m0 0l-8-8m8 8l8-8"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-8 bg-gray-50">
        {/* แผนกย่อย */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ผู้ช่วยผู้อำนวยการสำนักงานฯ */}
          <div className="card bg-teal-200 shadow-xl col-span-1 md:col-span-2">
            <div className="card-body text-center">
              <div className="flex justify-center">
                <img
                  src="/images/chai.jpg"
                  alt="พี่ดำ"
                  className="rounded-full h-24 w-24 object-cover"
                />
              </div>
              <h4>{translations.assistant.name[language as keyof typeof translations.assistant.name]}</h4>
              <h2 className="card-title justify-center">
                {translations.assistant.title[language as keyof typeof translations.assistant.title]}
              </h2>
              <h3>{translations.assistant.department[language as keyof typeof translations.assistant.department]}</h3>
            </div>
            
          </div>
          {/* ผู้จัดการโครงการส่วนกลาง */}
          <div className="card bg-lime-200 shadow-xl col-span-1">
            <div className="card-body">
              <h2 className="card-title">
                {translations.regional.title[language as keyof typeof translations.regional.title]}
              </h2>
              {/* เพิ่มรายชื่อจังหวัดตามที่กำหนด */}
              {translations.regional.regions.map((region, index) => (
                <p key={index}>{region[language as keyof typeof region]}</p>
              ))}
            </div>
          </div>

          {/* ผู้จัดการศูนย์ประสานงาน */}
          <div className="card bg-green-200 shadow-xl col-span-1">
            <div className="card-body">
              <h2 className="card-title">{translations.central.title[language as keyof typeof translations.central.title]}</h2>
              {translations.central.staff.map((staff, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={`/images/${['toe', 'noot', 'titi', 'Kru', 'Malai', 'tui', 'laor', 'jeab', 'some', 'Dan'][index]}.jpg`}
                      alt="Avatar"
                    />
                  </div>
                  <p>{staff.name[language as keyof typeof staff.name]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* กลุ่มสื่อสารและประชาสัมพันธ์ */}
          <div className="card bg-orange-50 shadow-xl col-span-1 md:col-span-2">
            <div className="card-body">
              <h2 className="card-title">{translations.communication.title[language as keyof typeof translations.communication.title]}</h2>
              {translations.communication.staff.map((staff, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={`/images/${['Chom', 'yut'][index]}.jpg`}
                      alt="Avatar"
                    />
                  </div>
                  <p>{staff.name[language as keyof typeof staff.name]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}