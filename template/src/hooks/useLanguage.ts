import { useState, useEffect, useCallback } from 'react';
import { LanguageService, SUPPORTED_LANGUAGES, LanguageConfig } from '../services/languageService';
import i18n from 'i18next';

export const useLanguage = () => {
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const handleLanguageChange = useCallback((languageCode: string) => {
    const rtlStatus = LanguageService.isRTL(languageCode);
    setIsRTL(rtlStatus);
    setCurrentLanguage(languageCode);
    
    // Set document direction
    LanguageService.setDocumentDirection(languageCode);
    
    // Store in localStorage
    localStorage.setItem('isRtl', rtlStatus.toString());
  }, []);

  const changeLanguage = useCallback(async (languageCode: string) => {
    await LanguageService.changeLanguage(languageCode);
    handleLanguageChange(languageCode);
  }, [handleLanguageChange]);

  useEffect(() => {
    // Initialize with current language
    const currentLang = LanguageService.getCurrentLanguage();
    handleLanguageChange(currentLang);

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [handleLanguageChange]);

  return {
    isRTL,
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
  };
};
