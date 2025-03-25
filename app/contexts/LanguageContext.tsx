// app/contexts/LanguageContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // ดึงค่าภาษาจาก localStorage หากมี หรือใช้ค่าเริ่มต้นเป็น 'th'
  const [language, setLanguage] = useState('th');
  
  // เมื่อมีการเปลี่ยนภาษา ให้บันทึกลงใน localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}