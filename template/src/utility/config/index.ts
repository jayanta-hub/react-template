// export const BaseURL = "https://saas.dev.api.musafirbiz.com";
const env = import.meta.env.VITE_APP_ENV;

export const BaseURL =
  env === 'uat'
    ? "https://saas.uat.in.gateway.musafirbiz.com"
    : env === 'qa'
      ? "https://saas.qa.gateway.musafirbiz.com"
      : env === 'development'
        ? "https://saas.qa.gateway.musafirbiz.com"
        : env === 'production'
          ? "https://saas.uat.in.gateway.musafirbiz.com"
          : "https://saas.uat.in.gateway.musafirbiz.com";

export const loginBaseURL =
  env === 'uat'
    ? "https://saas.uat.in.api.musafirbiz.com"
    : env === 'qa'
      ? "https://saas.qa.api.musafirbiz.com"
      : env === 'development'
        ? "https://saas.qa.api.musafirbiz.com"
        : env === 'production'
          ? "https://saas.uat.in.api.musafirbiz.com"
          : "https://saas.uat.in.api.musafirbiz.com";

export const APIversion = "/api/v1/";
export const SECRET_KEY = "musafir2.0secret";