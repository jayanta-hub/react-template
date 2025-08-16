
import { Visibility } from "@mui/icons-material";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Typography, useMediaQuery } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { useFormik } from "formik";
import Cookies from 'js-cookie';
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import GoogleLogo from "../../../assets/images/google.png";
import MusafirLogo from "../../../assets/images/musafirbiz-logo.svg";
import LanguageSwitcher from "../../../components/core-module/language-switcher/LanguageSwitcher";
import { useCreateTokenMutation, useLoginMutation, useLoginmethodsMutation } from "../../../store/musafirLoginApi";
import { ROUTES } from "../../../utility/constant";
import { theme } from '../../../theme';
import { customEnqueueSnackbar } from "../../../utility/helper";
import { Profile } from '../../../types/login/Login'

const Login: React.FC = (): JSX.Element => {
  const [login] = useLoginMutation();
  const [createToken] = useCreateTokenMutation();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();  // To capture the attempted route

  /* *******************************************TPP-2619 changes**************************************** */
  const [loginOptions, setLoginOptions] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<"Password" | "SSO" | "SAML" | "">("");
  const [loginmethods, { isLoading }] = useLoginmethodsMutation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:900px)");
  const [isMethodFetched, setIsMethodFetched] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [idToken, setIdToken] = useState();
  const [loginMethodsResponse, setLoginMethodsResponse] = useState([]);
  const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(false);
  const redirectPath = `${ROUTES.DASHBOARD}?theme=0`;
  const search = location.state?.from?.search
  const from = location.state?.from?.pathname ? `${location.state?.from?.pathname}${search ?? ""}` : redirectPath;
  const isRTL = localStorage.getItem("isRtl") === "true";
  /* *******************************************TPP-2619 changes - ends**************************************** */
  const MIN_PASSWORD_LENGTH = 8;
  const PASSWORD_REGEX = /[!@#$%^&*]/;
  const NO_WHITESPACE_REGEX = /^\S*$/;
  const UPPERCASE_REGEX = /[A-Z]/;
  const NUMBER_REGEX = /\d/;

  /* *******************************************TPP-2619 changes - starts**************************************** */
  const emailvalidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('invalid_email'))
      .required(t('email_required')),
  })

  const passwordvalidationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('password_required'))
      .min(MIN_PASSWORD_LENGTH, t('password_min_length', { min: MIN_PASSWORD_LENGTH }))
      .matches(PASSWORD_REGEX, t('password_special_char'))
      .matches(NO_WHITESPACE_REGEX, t('password_no_whitespace'))
      .matches(UPPERCASE_REGEX, t('password_uppercase'))
      .matches(NUMBER_REGEX, t('password_number'))
  })

  const formikLoginMethod = useFormik({
    initialValues: {
      email: "",
      loginMethod: "",
    },
    validationSchema: emailvalidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginmethods({
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0c",
            TransactionId: "de2ade5e6a0b4c75b44ab079f4f0b1b",
            IpAddress: "192.168.1.1",
            CountryCode: "IN",
          },
          Request: {
            Email: values.email,
          },
        })

      } catch (error) {
        console.error(error);
      }
    }
  });
  const formikPassword = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: passwordvalidationSchema,
    onSubmit: async () => {
    },
  });

  const handleLoginMethodSelection = async (method: "Password" | "SSO" | "SAML") => {
    setSelectedOption(method);
    formikLoginMethod.setFieldValue("loginMethod", method);
    if (method === "SSO" || method === "SAML") {
      handleFinalLoginWithSSO(method);
    }
  };

  const handleFinalLoginWithSSO = async (method: "Password" | "SSO" | "SAML") => {
    try {
      const ssoModeOflogin = loginMethodsResponse.find((option) => option.ModeOfLogin === method);
      const requestLoginPayload = {
        Context: {
          UserAgent: "Mozilla/5.0",
          TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0c",
          TransactionId: "de2ade5e6a0b4c75b44ab079f4f0b1b",
          IpAddress: "192.168.1.1",
          CountryCode: "IN",
        },
        Request:
        {
          "SSO": method === "SSO" ? { Provider: ssoModeOflogin?.LoginProvider } : null,
          "Saml": method === "SAML" ? { Provider: ssoModeOflogin?.LoginProvider } : null,
          "Password": null,
          "SourceId": ssoModeOflogin?.SourceId,
        },

      };

      const response = await login(requestLoginPayload).unwrap();
      try {

        if (response?.Context.StatusCode === 302) {
          if (response?.Response?.Url) {
            window.location.assign(response?.Response?.Url);
          } else {
            enqueueSnackbar(response?.statusDescription || "Login failed", { variant: "error" });
          }
          return;
        } else {
          enqueueSnackbar(response?.statusDescription || "Login failed", { variant: "error" });
        }
      } catch (error) {
        console.error(error, "login error")
        enqueueSnackbar("Error while generating access token. Please try again.", { variant: "error" });
        resetLoginComponent();
      }
    } catch (error) {
      enqueueSnackbar(error?.data?.Context?.Message, { variant: "error" });
      resetLoginComponent()
    }
  };

  const handleFinalLogin = async () => {
    setIsLoginLoading(true)
    try {
      await passwordvalidationSchema.validate(
        { password: formikPassword.values.password },
        { abortEarly: false }
      );
      const finalPayload = {
        "SSO": { "Provider": "" },
        "Saml": { "Provider": "" },
        "Password": {
          "Email": formikLoginMethod.values.email,
          "Password": formikPassword.values.password,
        },
        "SourceId": "",
      };

      const requestLoginPayload = {
        Context: {
          UserAgent: "Mozilla/5.0",
          TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0c",
          TransactionId: "de2ade5e6a0b4c75b44ab079f4f0b1b",
          IpAddress: "192.168.1.1",
          CountryCode: "IN",
        },
        Request:
        {
          "SSO": { "Provider": "" },
          "Saml": { "Provider": "" },
          "Password": {
            "Email": formikLoginMethod.values.email,
            "Password": formikPassword.values.password,
          },
          "SourceId": "",
        },

      };

      const response = await login(requestLoginPayload).unwrap();
      try {
        if (response?.Context.StatusCode === 200) {
          if (response.Context.StatusCode === 200) {

            const profilesList = response?.Response?.Profiles || [];
            const idToken = response?.Response?.IdToken;

            if (profilesList.length > 0) {
              if (profilesList.length === 1) {
                setProfiles(profilesList);
                setIdToken(idToken);
                sendCreateTokenRequest({
                  ProfileId: profilesList[0]?.ProfileId,
                  idToken: idToken
                });
              } else {
                setProfiles(profilesList);
                setIdToken(idToken);
                setOpenProfileDialog(true);
              }
            }
          }
        }
        else {
          enqueueSnackbar(response?.statusDescription || "Login failed", { variant: "error" });
        }
        setIsLoginLoading(false)
      } catch (error) {
        console.error(error, "error")
        enqueueSnackbar("Error while generating access token. Please try again.", { variant: "error" });
        resetLoginComponent();
        setIsLoginLoading(false)
      }
    } catch (error) {
      setIsLoginLoading(false)
      enqueueSnackbar(error?.data?.Context?.Message, { variant: "error" });
      resetLoginComponent()
    }
  };

  const sendCreateTokenRequest = async ({ ProfileId, idToken }) => {
    try {

      const tokenPayload = {
        Context: {
          UserAgent: "Mozilla/5.0",
          TrackingId: "da865192-197d-4c63-aaa6-568f6001abf6",
          TransactionId: "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
          IpAddress: "192.168.1.1",
          CountryCode: "IN",
        },
        Request: {
          ProfileId: ProfileId,
          IdToken: idToken,
        },
      };
      const tokenResponse = await createToken(tokenPayload).unwrap();
      Cookies.set('jeetat', JSON.stringify({
        token: tokenResponse?.Response?.Auth1dot0?.AccessToken,
        Expiry: tokenResponse?.Response?.Auth1dot0?.ExpiryAt
      }));

      Cookies.set('jeetrt', JSON.stringify({
        token: tokenResponse?.Response?.RefreshToken,
        Expiry: tokenResponse?.Response?.RefreshTokenExpiryAt
      }));
      if (tokenResponse?.Context?.StatusCode === 200 && (tokenResponse?.Response?.AccessDetail?.AccessToken !== "" || tokenResponse?.Response?.AccessDetail?.AccessToken !== null)) {
        sessionStorage.setItem("accessToken", tokenResponse?.response?.accessToken);
        navigate(from, { replace: true });
      } else {
        enqueueSnackbar("Token creation failed. Please try again.", { variant: "error" });
      }
    } catch (tokenError) {
      if (tokenError?.data?.Context?.StatusCode === 400) {
        enqueueSnackbar(tokenError?.data?.Context?.Message, { variant: "error" });

      } else if (tokenError?.data?.Context?.StatusCode) {
        return;
      }
      else {
        enqueueSnackbar("Error on creating Token", { variant: "error" });
      }
    }
  };

  const handleProfileSelection = () => {
    setOpenProfileDialog(false);
    sendCreateTokenRequest({
      ProfileId: selectedProfile?.ProfileId,
      idToken: idToken
    });
  }

  const resetLoginComponent = () => {
    formikLoginMethod.resetForm();
    formikPassword.resetForm();
    setSelectedOption("");
    setIsEmailDisabled(false);
    setLoginOptions([]);
    setIsMethodFetched(false);
    setSelectedProfile(null);
    setOpenProfileDialog(false);
  };

  return (
    <div>
      <Box display={"flex"} sx={{ m: 2 }} justifyContent="flex-end">
        <LanguageSwitcher />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" padding={isSmallScreen ? 2 : 2}>
        <Box component="img" src={MusafirLogo} alt="Musafir Logo" sx={{ width: isSmallScreen ? 150 : 175, marginBottom: 8, marginTop: 4 }} />

        <Box sx={{
          display: "flex", flexDirection: "column", alignItems: "center", width: isSmallScreen ? "90%" : isMediumScreen ? "70%" : "40%",
          maxWidth: "500px",
          padding: isSmallScreen ? 2 : 4,
          borderRadius: isSmallScreen ? 0 : 2,
        }}>
          <Typography sx={{ fontWeight: 600, fontSize: isSmallScreen ? "24px" : "32px", marginBottom: 1 }}>{t("welcome_back")}</Typography>
          <Typography color="#6D6D6D" fontSize={isSmallScreen ? "14px" : "16px"} textAlign="center">
            {t("enter_login_details")}
          </Typography>

          <Box sx={{ width: "100%", mt: 3 }}>
            <form onSubmit={formikLoginMethod.handleSubmit}>
              <Typography sx={{ fontWeight: 400, fontSize: "14px", textAlign: "center", color: "#6D6D6D", width: "100%", marginBottom: -2 }}>
                {t("work_email")}
              </Typography>
              <TextField
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                {...formikLoginMethod.getFieldProps("email")}
                error={formikLoginMethod.touched.email && Boolean(formikLoginMethod.errors.email)}
                helperText={formikLoginMethod.touched.email && formikLoginMethod.errors.email}
                InputProps={{ inputProps: { style: { textAlign: "center" }, disabled: isEmailDisabled } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.customColors?.lightBlue[7],
                  },
                }}
              />
              {!isMethodFetched && (
                <Button
                  id="login-button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, bgcolor: "#0087FA", color: "white", height: 50, textTransform: "none", borderRadius: "6px" }}
                  type="submit"
                  disabled={isLoading || isDisabled}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : t("choose_login_methods")}
                </Button>
              )}
            </form>

            {!selectedOption && (
              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                {loginOptions.includes("Password") && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: "white", color: "black", border: "1px solid #ccc", height: 50, textTransform: "none", borderRadius: "6px" }}
                    onClick={() => handleLoginMethodSelection("Password")}
                  >
                    {t("login_with_password")}
                  </Button>
                )}
                {/* Future use */}
                {isMethodFetched &&
                  loginOptions.some(
                    (option) => option.toLowerCase() === "sso" || option.toLowerCase() === "saml"
                  ) && (
                    <Divider sx={{ my: 3 }} />
                  )}
                {loginOptions.includes("SSO") && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: "white", color: "black", border: "1px solid #ccc", height: 50, textTransform: "none", borderRadius: "6px" }}
                      onClick={() => handleLoginMethodSelection("SSO")}
                    >
                      Login with Google
                      <img src={GoogleLogo} alt="Google Logo" style={{ width: 20, height: 18, [isRTL ? "paddingRight" : "paddingLeft"]: 5, [isRTL ? "marginRight" : "marginLeft"]: '1%', }} ></img>
                    </Button>
                    
                    {/* Additional SSO Providers */}
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ border: "1px solid #ccc", height: 50, textTransform: "none", borderRadius: "6px" }}
                      onClick={() => handleLoginMethodSelection("SSO")}
                    >
                      Login with Microsoft
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ border: "1px solid #ccc", height: 50, textTransform: "none", borderRadius: "6px" }}
                      onClick={() => handleLoginMethodSelection("SSO")}
                    >
                      Login with Apple
                    </Button>
                  </Box>
                )}
                {loginOptions.some(option => option.toLowerCase() === "saml") && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: "white", color: "black", border: "1px solid #ccc", height: 50, textTransform: "none", borderRadius: "6px" }}
                    onClick={() => handleLoginMethodSelection("SAML")}
                  >
                    {t("sso_login")}
                    {/* <img src={GoogleLogo} alt="Google Logo" style={{ width: 18, height: 14, paddingLeft: 5,marginLeft:'1%' }} ></img>  */}
                  </Button>
                )}
              </Box>
            )}
            {selectedOption === "Password" && (
              <form onSubmit={formikPassword.handleSubmit}>
                <Typography sx={{ fontWeight: 400, fontSize: "14px", textAlign: "center", color: "#6D6D6D", width: "100%", marginBottom: -2 }}>
                  {t("password_*")}
                </Typography>
                <TextField
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  {...formikPassword.getFieldProps("password")}
                  error={formikPassword.touched.password && Boolean(formikPassword.errors.password)}
                  helperText={formikPassword.touched.password && formikPassword.errors.password}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.customColors?.lightBlue[7],
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                    inputProps: { style: { textAlign: "center" } },
                  }}
                />
                {selectedOption === "Password" && (
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: theme.palette.customColors?.blue[10], color: "white", height: 50, textTransform: "none", borderRadius: "6px" }} onClick={handleFinalLogin} disabled={isLoginLoading}> {isLoginLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : t("login")}
                  </Button>
                )}
              </form>
            )}
            <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}>
              <DialogTitle>{t('select_profile')}</DialogTitle>
              <DialogContent sx={{ width: 300 }}>
                <List>
                  {profiles.map((profile) => {
                    return (
                      <ListItem key={profile.ProfileId} disablePadding>
                        <ListItemButton
                          key={profile.ProfileId} selected={selectedProfile?.ProfileId === profile.ProfileId} onClick={() => setSelectedProfile(profile)}
                          sx={(theme) => ({
                            paddingLeft: 1,
                            borderRadius: "6px",
                            backgroundColor: selectedProfile?.ProfileId === profile.ProfileId
                              ? theme.palette.customColors?.blue[4]
                              : "transparent",
                            color: selectedProfile?.ProfileId === profile.ProfileId ? theme.palette.primary.contrastText : "inherit",
                            cursor: 'pointer',
                            "&:hover": {
                              backgroundColor: selectedProfile?.ProfileId === profile.ProfileId
                                ? theme.palette.customColors?.blue[10]
                                : theme.palette.customColors?.blue[0],
                            },
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.customColors?.blue[10],
                              "&:hover": {
                                backgroundColor: theme.palette.customColors?.blue[10],
                              },
                            },
                          })}>
                          <ListItemText primary={`${profile.SourceName} `} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { resetLoginComponent() }} sx={{ textTransform: "none", color: theme.palette.customColors?.blue[10] }}>{t("cancel")}</Button>
                <Button onClick={handleProfileSelection} disabled={!selectedProfile} sx={{ textTransform: "none", color: theme.palette.customColors?.blue[10] }}>{t("continue")}</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
/* *******************************************TPP-2619 changes - ends**************************************** */
export default Login;