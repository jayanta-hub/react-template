// Application Routes
export const ROUTES = Object.freeze({
  LOGIN: "/login",
  LOGIN_NEW: "/login-new",
  LOGIN_DEMO: "/login-demo",
  DASHBOARD: "/dashboard",
  NOTFOUND: '/not-found',
  NOTAUTHORIZED: '/not-authorized',
} as const);

// Form Constants
export const FORM_CONSTANTS = Object.freeze({
  EMAIL: "Email",
  SUBMIT: "Submit",
  SUCCESS: "Success",
  ERROR: "Error",
  LOGIN: "Login",
  USERNAME: "Username",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm Password",
} as const);

// Error Messages
export const ERROR_MESSAGES = Object.freeze({
  INVALID_EMAIL: "Invalid email",
  INVALID_PASSWORD: "Password cannot be empty",
  MISMATCHED_PASSWORD: "Passwords did not match",
  SOMETHING_WENT_WRONG: "Something went wrong.",
} as const);

// API Constants
export const API_CONSTANTS = Object.freeze({
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const);

// Local Storage Keys
export const STORAGE_KEYS = Object.freeze({
  TEMPLATE_VALUE: "templateValue",
  IS_RTL: "isRtl",
  LAST_VISITED: "lastVisited",
} as const);
