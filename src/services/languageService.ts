import i18n from 'i18next';

export interface LanguageConfig {
  code: string;
  name: string;
  isRTL: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', isRTL: false },
  { code: 'ar', name: 'العربية', isRTL: true },
  { code: 'ar-SA', name: 'العربية (السعودية)', isRTL: true },
  { code: 'hn', name: 'हिन्दी', isRTL: false },
];

export class LanguageService {
  /**
   * Check if language is RTL
   */
  static isRTL(languageCode: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => 
      lang.code === languageCode && lang.isRTL
    );
  }

  /**
   * Get current language
   */
  static getCurrentLanguage(): string {
    return i18n.language;
  }

  /**
   * Change language
   */
  static async changeLanguage(languageCode: string): Promise<void> {
    await i18n.changeLanguage(languageCode);
  }

  /**
   * Set document direction based on language
   */
  static setDocumentDirection(languageCode: string): void {
    const direction = this.isRTL(languageCode) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
  }

  /**
   * Get document direction
   */
  static getDocumentDirection(): string {
    return document.documentElement.getAttribute('dir') || 'ltr';
  }

  /**
   * Get RTL status for current language
   */
  static getCurrentRTLStatus(): boolean {
    return this.isRTL(this.getCurrentLanguage());
  }

  /**
   * Initialize language service
   */
  static initialize(): void {
    const currentLanguage = this.getCurrentLanguage();
    this.setDocumentDirection(currentLanguage);
  }
}
