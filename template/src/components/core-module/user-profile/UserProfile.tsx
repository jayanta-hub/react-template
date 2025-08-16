import { Box, IconButton, Menu, Tooltip, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import addIcon from '../../../assets/images/add_icon.svg';
import comfortIcon from '../../../assets/images/comfort_icon.svg';
import darkIcon from '../../../assets/images/dark_icon.svg';
import editIcon from '../../../assets/images/edit_icon.svg';
import lightIcon from '../../../assets/images/light_icon.svg';
import profile from '../../../assets/images/profile.png';
import settingIcon from '../../../assets/images/setting_icon.svg';
import Logout from '../../../pages/login-module/logout/Logout';
const UserProfile: React.FC = () => {
    const theme = useTheme();
    const isRTL = localStorage.getItem("isRtl") === "true";

    const [openProfile, setOpenProfile] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setOpenProfile(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setOpenProfile(null);
    };
    return (<>
        <Box
            sx={{ display: "flex", alignItems: "center", float: 'right', backgroundColor: theme.palette.customColors?.lightGray[10], width: "30px", height: "30px", justifyContent: "center", borderRadius: "6px", }}>
            <Tooltip title={t("profile")}>
                <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                    <Typography color={theme.palette.customColors?.black[3]} fontSize="12px" fontFamily="Poppins" fontWeight="400" lineHeight="18px" textAlign="center" >
                        <Box
                            component="img"
                            src={profile}
                            sx={{
                                height: "30px",
                                width: "30px",
                                objectFit: "contain"
                            }} />
                    </Typography>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={openProfile}
                disableScrollLock
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(openProfile)}
                onClose={handleCloseUserMenu}
                slotProps={{
                    paper: {
                        sx: {
                            width: "303px",
                            // height: "557px",
                            borderRadius: "10px",
                            background: theme.palette.customColors?.white[14],
                            border: `1px solid ${theme.palette.customColors?.lightGray[12]}`,
                            boxShadow: `0px 4px 30px 0px ${theme.palette.customColors?.black[5]}`,
                            "&::-webkit-scrollbar": {
                                width: "4px",
                                borderRadius: "10px",
                                backgroundColor: theme.palette.customColors?.white[0]
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: theme.palette.customColors?.grey[10],
                                borderRadius: "10px",
                            },
                        },
                    }
                }}>
                <Box className="flex flex-col items-center mb-2 ">
                    <Typography color={theme.palette.customColors?.black[1]} fontSize="12px" fontFamily="Poppins" fontWeight="500" lineHeight="14px" marginTop="0.5rem" >
                        jennyfernando@in.musafir.com
                    </Typography>
                    <Typography color={theme.palette.customColors?.lightGray[14]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px" marginTop="0.25rem">
                        {t('managed_by_in.musafir.com')}
                    </Typography>
                    <Box
                        component="img"
                        src={profile}
                        sx={{
                            height: "60px",
                            width: "60px",
                            margin: "0.5rem",
                            objectFit: "contain",
                            borderRadius: "43px",
                            border: `4px solid ${theme.palette.customColors?.pink[1]}`
                        }} />
                    <Typography color={theme.palette.customColors?.black[1]} fontSize="16px" fontFamily="Poppins" fontWeight="600" lineHeight="14px">
                        Hi, Jenny
                    </Typography>
                    <button style={{
                        border: `0.5px solid ${theme.palette.customColors?.black[4]}`,
                        borderRadius: "10px",
                        padding: "0.3rem 2rem 0.3rem 2rem",
                        marginTop: "0.75rem"
                    }}>
                        <Typography color={theme.palette.customColors?.blue[10]} fontSize="12px" fontFamily="Poppins" fontWeight="500" lineHeight="18px">
                            {t('manage_account')}
                        </Typography>
                    </button>
                </Box>
                <Box className="flex flex-col items-start">
                    {/* <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[10], borderRadius: "50%", justifyContent: "center" }}>
                            <Typography>
                                J
                            </Typography>
                        </Box>

                        <Box className="flex flex-col items-start">
                            <Typography className="cursor-pointer" color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px" marginTop="0.25rem">
                                Jenny Fernando
                            </Typography>
                            <Typography className="cursor-pointer" color={theme.palette.customColors?.grey[8]} fontSize="8px" fontFamily="Poppins" fontWeight="400" lineHeight="12px" marginTop="0.25rem">
                                jennyfernando@gmail.com
                            </Typography>
                        </Box>

                    </Box>
                    <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[14], borderRadius: "50%", justifyContent: "center" }}>
                            <Typography>
                                J
                            </Typography>
                        </Box>

                        <Box className="flex flex-col items-start">
                            <Typography className="cursor-pointer" color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px" marginTop="0.25rem">
                                Jenny Fernando
                            </Typography>
                            <Typography className="cursor-pointer" color={theme.palette.customColors?.grey[8]} fontSize="8px" fontFamily="Poppins" fontWeight="400" lineHeight="12px" marginTop="0.25rem">
                                jennyfernando@gmail.com
                            </Typography>
                        </Box>

                    </Box> */}
                    {/* { additional options} */}
                    <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[12], borderRadius: "50%", justifyContent: "center" }}>
                            <Box
                                component="img"
                                src={addIcon}
                                sx={{
                                    height: "9px",
                                    width: "9px",
                                    objectFit: "contain"
                                }}
                                className="cursor-pointer"
                            />
                        </Box>

                        <Box className="flex flex-col items-center cursor-pointer">
                            <Typography color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px">
                                {t('add_another_account')}
                            </Typography>

                        </Box>

                    </Box>
                    <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[12], borderRadius: "50%", justifyContent: "center" }}>
                            <Box
                                component="img"
                                src={editIcon}
                                sx={{
                                    height: "12px",
                                    width: "12px",
                                    objectFit: "contain"
                                }}
                                className="cursor-pointer"
                            />
                        </Box>

                        <Box className="flex flex-col items-center cursor-pointer" >
                            <Typography color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px">
                                {t('musafir_labs')}
                            </Typography>

                        </Box>

                    </Box>
                    <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[12], borderRadius: "50%", justifyContent: "center" }}>
                            <Box
                                component="img"
                                src={settingIcon}
                                sx={{
                                    height: "15px",
                                    width: "15px",
                                    objectFit: "contain"
                                }}
                                className="cursor-pointer"
                            />
                        </Box>

                        <Box className="flex flex-col items-center">
                            <Typography className="cursor-pointer" color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px">
                                {t('settings')}
                            </Typography>

                        </Box>

                    </Box>
                    <Box className="flex flex-row items-center w-[283px] h-[41px] ml-2 mr-2 mt-1 " sx={{
                        background: theme.palette.customColors?.white[0],
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "2px",
                        borderBottomLeftRadius: "2px",
                    }}>
                        {/* <Box className="flex items-center m-[0.5rem]" sx={{ width: "23px", height: "23px", backgroundColor: theme.palette.customColors?.blue[12], borderRadius: "50%" ,justifyContent:"center"}}>
                    <Box
                            component="img"
                            src={signOutIcon}
                            sx={{
                                height: "10.83px",
                                width: "10.83px",
                                objectFit: "contain"
                            }}
                        />
</Box> */}

                        {/* <Box className="flex flex-col items-center">
                        <Typography color={theme.palette.customColors?.black[1]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px">
                       Sign out
                            </Typography>
                           
                        </Box> */}
                        <Logout isUserProfile={true} />

                    </Box>

                    {/* {mode change} */}
                    <Box className="flex flex-row items-center ml-2 mr-2 mt-4">
                        <Typography color={theme.palette.customColors?.lightGray[14]} fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="14px" margin="0.5rem">
                            {t('mode')}:</Typography>
                        <button className="ml-2" style={{
                            borderRadius: "4px",
                            width: "71px", height: "28px", backgroundColor: theme.palette.customColors?.white[0], [isRTL ? "paddingRight" : "paddingLeft"]: "1.5rem",
                        }}>
                            <Box
                                component="img"
                                src={lightIcon}
                                sx={{
                                    height: "16.33px",
                                    width: "16.33px",
                                    objectFit: "contain",
                                    color: "red"
                                }}
                            />
                        </button>
                        <button className="ml-2" style={{
                            borderRadius: "4px",
                            width: "71px", height: "28px", backgroundColor: theme.palette.customColors?.white[0], [isRTL ? "paddingRight" : "paddingLeft"]: "1.5rem",
                        }}>
                            <Box
                                component="img"
                                src={darkIcon}
                                sx={{
                                    height: "16.33px",
                                    width: "16.33px",
                                    objectFit: "contain"
                                }}
                            />
                        </button>
                        <button className="ml-2" style={{
                            borderRadius: "4px",
                            width: "71px", height: "28px", backgroundColor: theme.palette.customColors?.white[0], [isRTL ? "paddingRight" : "paddingLeft"]: "1.5rem",
                        }}>
                            <Box
                                component="img"
                                src={comfortIcon}
                                sx={{
                                    height: "16.33px",
                                    width: "16.33px",
                                    objectFit: "contain"
                                }}
                            />
                        </button>


                    </Box>
                </Box>
            </Menu>
        </Box>
    </>)
}
export default UserProfile