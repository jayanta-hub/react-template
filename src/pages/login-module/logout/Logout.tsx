import LogoutIcon from '@mui/icons-material/Logout';
import { Box, IconButton, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Cookies from 'js-cookie';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import signOutIcon from '../../../assets/images/sign_out_icon.svg';
import { ROUTES } from '../../../utility/constant';
import useSearch from "../../../utility/hooks/useSearch";
/**
 * A button to log the user out of the application and navigate to the root route
 *
 * @returns A React component that renders a logout button and a dialog to confirm the logout
 */
const Logout: React.FC<{ isUserProfile: boolean }> = ({ isUserProfile }): JSX.Element => {
    const { resetSearchState } = useSearch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    /**
     * Logs the user out of the application, dispatches a logout action, and navigates
     * to the root route. If the logout is successful, a success message is displayed.
     * If the logout fails, an error message is displayed with the status description from
     * the response. If the logout throws an error, an error message is displayed with
     * a generic message.
     */
    const handleLogout = async () => {
        // try {
        //   const response = await logout({}).unwrap();
        //   if (response.status.statusCode == 1) {
        //     toast.success(response?.status?.statusDescription || "Logout successful!");
        dispatch({ type: 'RESET_STATE' });
        localStorage.removeItem('selectedTab');
        localStorage.clear();
        sessionStorage.clear();
        Cookies.remove('jeetat');
        Cookies.remove('jeetrt');
        resetSearchState();
        navigate(ROUTES.LOGIN, { state: { from: location.pathname }, replace: true });
        //   } else {
        //     toast.error(response?.status?.statusDescription || "User not found.");
        //   }
        // } catch (error: any) {
        //   toast.error("Unable to logout. Please try again later");
        // }
    };

    return (
        <React.Fragment>
            {!isUserProfile ? (<>
                <IconButton
                    color="inherit" // "inherit" will take the color from the parent (black in this case)
                    onClick={handleOpenDialog}
                    aria-label="logout"
                    style={{
                        color: 'black', // Explicitly setting the color to black
                        fontSize: isMobileView ? '1.5rem' : '2rem', // Adjust size based on screen size
                        padding: isMobileView ? '6px' : '8px', // Adjust padding for mobile view
                    }}            >

                    <LogoutIcon style={{ color: 'black', fontSize: isMobileView ? '1.0rem' : '1.5rem' }} />  {/* Setting icon color to black */}
                    <ListItemText primary={t('logout')} style={{ color: 'black', fontSize: isMobileView ? '0.8rem' : '1.2rem' }} />  {/* Setting text color to black */}

                </IconButton>
            </>
            ) : (
                <>
                    {/* <button  onClick={handleOpenDialog}> */}
                    <Box onClick={handleOpenDialog} className="flex items-center m-[0.5rem] cursor-pointer" sx={{ width: "23px", height: "23px", backgroundColor: "#EEF7FF", borderRadius: "50%", justifyContent: "center" }}>
                        <Box
                            component="img"
                            src={signOutIcon}
                            sx={{
                                height: "10.83px",
                                width: "10.83px",
                                objectFit: "contain"
                            }}
                        />
                    </Box>

                    <Box onClick={handleOpenDialog} className="flex flex-col items-center cursor-pointer">
                        <Typography color="#000000" fontSize="10px" fontFamily="Poppins" fontWeight="500" lineHeight="15px">
                            {t('sign_out')}
                        </Typography>

                    </Box>
                    {/* </button> */}
                </>
            )}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('logout_message')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout} style={{ color: 'black' }}>{t('Yes')}</Button>
                    <Button onClick={handleCloseDialog} autoFocus style={{ color: 'black' }}>
                        {t('No')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
export default Logout;
