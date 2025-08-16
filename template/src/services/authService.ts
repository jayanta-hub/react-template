import Cookies from 'js-cookie';

export interface AuthToken {
  token: string;
  [key: string]: any;
}

export class AuthService {
  private static readonly TOKEN_COOKIE_NAME = 'jeetat';
  private static readonly REFRESH_TOKEN_COOKIE_NAME = 'jeetrt';

  /**
   * Get the current authentication token
   */
  static getAuthToken(): AuthToken | null {
    try {
      const tokenString = Cookies.get(this.TOKEN_COOKIE_NAME);
      if (!tokenString) return null;
      
      const token = JSON.parse(tokenString);
      return token;
    } catch (error) {
      console.error('Failed to parse auth token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token?.token;
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    try {
      const tokenString = Cookies.get(this.REFRESH_TOKEN_COOKIE_NAME);
      if (!tokenString) return null;
      
      const token = JSON.parse(tokenString);
      return token?.token || null;
    } catch (error) {
      console.error('Failed to parse refresh token:', error);
      return null;
    }
  }

  /**
   * Set authentication token
   */
  static setAuthToken(token: AuthToken): void {
    Cookies.set(this.TOKEN_COOKIE_NAME, JSON.stringify(token));
  }

  /**
   * Set refresh token
   */
  static setRefreshToken(token: AuthToken): void {
    Cookies.set(this.REFRESH_TOKEN_COOKIE_NAME, JSON.stringify(token));
  }

  /**
   * Clear all authentication data
   */
  static logout(): void {
    Cookies.remove(this.TOKEN_COOKIE_NAME);
    Cookies.remove(this.REFRESH_TOKEN_COOKIE_NAME);
  }

  /**
   * Get template value from localStorage
   */
  static getTemplateValue(): string {
    return localStorage.getItem('templateValue') || '';
  }

  /**
   * Set template value in localStorage
   */
  static setTemplateValue(value: string): void {
    localStorage.setItem('templateValue', value);
  }
}
