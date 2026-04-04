import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Language, Translations } from '../constants/Translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  n: (input: string | number) => string;
  isReady: boolean;
};

const digitMaps: Record<string, string[]> = {
  en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  or: ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
  ml: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '൭', '൮', '൯'],
  ta: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync('user-language');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language', error);
    } finally {
      setIsReady(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await SecureStore.setItemAsync('user-language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  const t = (key: string): string => {
    const translation = Translations[language];
    if (!translation) return key;
    return translation[key] || key;
  };

  const n = (input: string | number): string => {
    const str = String(input);
    const map = digitMaps[language] || digitMaps.en;
    if (language === 'en') return str;
    
    return str.split('').map(char => {
      const digit = parseInt(char, 10);
      if (!isNaN(digit) && char >= '0' && char <= '9') {
        return map[digit];
      }
      return char;
    }).join('');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, n, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
