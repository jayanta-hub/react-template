import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Login from './Login';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useCreateTokenMutation, useLoginmethodsMutation } from '../../../store/musafirLoginApi';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import * as Yup from 'yup';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('../../../store/musafirLoginApi');
jest.mock('notistack', () => ({ enqueueSnackbar: jest.fn() }));
jest.mock('js-cookie', () => ({ set: jest.fn() }));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('../../../utility/helper', () => ({
  customEnqueueSnackbar: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLoginMutation = jest.fn();
const mockCreateTokenMutation = jest.fn();
const mockLoginmethodsMutation = jest.fn();
const mockLoginUnwrap = jest.fn();
const mockCreateTokenUnwrap = jest.fn();
const mockLoginmethodsUnwrap = jest.fn();

const mockLocation = {
  state: { 
    from: { 
      pathname: '/dashboard', 
      search: '?param=value' 
    } 
  },
  pathname: '/login',
  search: '',
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useLoginMutation as jest.Mock).mockReturnValue([mockLoginMutation]);
    (useCreateTokenMutation as jest.Mock).mockReturnValue([mockCreateTokenMutation]);
    (useLoginmethodsMutation as jest.Mock).mockReturnValue([mockLoginmethodsMutation, { isLoading: false }]);
    mockLoginMutation.mockReturnValue({ unwrap: mockLoginUnwrap });
    mockCreateTokenMutation.mockReturnValue({ unwrap: mockCreateTokenUnwrap });
    mockLoginmethodsMutation.mockReturnValue({ unwrap: mockLoginmethodsUnwrap });
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn() },
      writable: true,
    });
    localStorage.setItem('isRtl', 'false');
  });

  it('renders login form with email field', () => {
    render(<Login />);
    expect(screen.getByText('work_email')).toBeInTheDocument();
    expect(screen.getByText('choose_login_methods')).toBeInTheDocument();
  });

  it('handles email form submission successfully', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' },
        { ModeOfLogin: 'SSO' },
        { ModeOfLogin: 'SAML' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockLoginmethodsMutation).toHaveBeenCalled();
    });
  });

  it('handles email form submission with no login methods', async () => {
    mockLoginmethodsUnwrap.mockResolvedValue({ Response: [] });
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('no_login_methods_available', { variant: 'error' });
    });
  });

  it('handles email form submission error', async () => {
    mockLoginmethodsUnwrap.mockRejectedValue({ 
      data: { Context: { Message: 'API Error' } } 
    });
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } }); 
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
  });

  it('handles email form submission error without context message', async () => {
    mockLoginmethodsUnwrap.mockRejectedValue({});
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
  });

  it('shows password login option when available', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('login_with_password')).toBeInTheDocument();
    });
  });

  it('shows SSO login option when available', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'SSO' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    render(<Login />);
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });
  });

  it('shows SAML login option when available', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'SAML' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('sso_login')).toBeInTheDocument();
    });
  });

  it('handles password login method selection', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      expect(screen.getByText('password_*')).toBeInTheDocument();
    });
  });

  it('handles SSO login method selection', async () => {
    const mockResponse = {
      Response: [
        { 
          ModeOfLogin: 'SSO',
          LoginProvider: 'Google',
          SourceId: '123'
        }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 302 },
      Response: { Url: 'https://google.com' }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const ssoButton = screen.getByText('Login with Google');
      fireEvent.click(ssoButton);
    });

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith('https://google.com');
    });
  });

  it('handles SSO login method selection without URL', async () => {
    const mockResponse = {
      Response: [
        { 
          ModeOfLogin: 'SSO',
          LoginProvider: 'Google',
          SourceId: '123'
        }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 302 },
      Response: {}
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const ssoButton = screen.getByText('Login with Google');
      fireEvent.click(ssoButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Login failed', { variant: 'error' });
    });
  });

  it('handles SSO login method selection with non-302 status', async () => {
    const mockResponse = {
      Response: [
        { 
          ModeOfLogin: 'SSO',
          LoginProvider: 'Google',
          SourceId: '123'
        }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 400 },
      statusDescription: 'Bad Request'
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const ssoButton = screen.getByText('Login with Google');
      fireEvent.click(ssoButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Bad Request', { variant: 'error' });
    });
  });

  it('handles SSO login method selection error', async () => {
    const mockResponse = {
      Response: [
        { 
          ModeOfLogin: 'SSO',
          LoginProvider: 'Google',
          SourceId: '123'
        }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockRejectedValue({
      data: { Context: { Message: 'SSO Error' } }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const ssoButton = screen.getByText('Login with Google');
      fireEvent.click(ssoButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('SSO Error', { variant: 'error' });
    });
  });

  it('handles password login submission successfully with single profile', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Auth1dot0: { AccessToken: 'token', ExpiryAt: 'exp' },
        RefreshToken: 'refresh',
        RefreshTokenExpiryAt: 'refreshExp',
        accessToken: 'accessToken'
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(mockCreateTokenMutation).toHaveBeenCalled();
      expect(Cookies.set).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('handles password login submission with multiple profiles', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [
          { ProfileId: '1', SourceName: 'Profile1' },
          { ProfileId: '2', SourceName: 'Profile2' }
        ],
        IdToken: 'idtoken'
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText('select_profile')).toBeInTheDocument();
    });
  });

  it('handles password login submission with no profiles', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [],
        IdToken: 'idtoken'
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      // Should not show profile dialog
      expect(screen.queryByText('select_profile')).not.toBeInTheDocument();
    });
  });

  it('handles password login submission with non-200 status', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 400 },
      statusDescription: 'Bad Request'
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Bad Request', { variant: 'error' });
    });
  });

  it('handles password login submission error', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockRejectedValue({
      data: { Context: { Message: 'Login Error' } }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Login Error', { variant: 'error' });
    });
  });

  it('handles token creation error (400)', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockRejectedValue({
      data: { Context: { StatusCode: 400, Message: 'Token Error' } }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Token Error', { variant: 'error' });
    });
  });

  it('handles token creation error (other status)', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockRejectedValue({
      data: { Context: { StatusCode: 500, Message: 'Server Error' } }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      // Should return early for non-400 status
      expect(enqueueSnackbar).not.toHaveBeenCalledWith('Server Error', { variant: 'error' });
    });
  });

  it('handles token creation error (no context)', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockRejectedValue({});

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Error on creating Token', { variant: 'error' });
    });
  });

  it('handles profile selection in dialog', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [
          { ProfileId: '1', SourceName: 'Profile1' },
          { ProfileId: '2', SourceName: 'Profile2' }
        ],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Auth1dot0: { AccessToken: 'token', ExpiryAt: 'exp' },
        RefreshToken: 'refresh',
        RefreshTokenExpiryAt: 'refreshExp',
        accessToken: 'accessToken'
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Profile1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Profile1'));
    });

    await waitFor(() => {
      const continueButton = screen.getByText('continue');
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(mockCreateTokenMutation).toHaveBeenCalled();
    });
  });

  it('handles cancel in profile dialog', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [
          { ProfileId: '1', SourceName: 'Profile1' },
          { ProfileId: '2', SourceName: 'Profile2' }
        ],
        IdToken: 'idtoken'
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('cancel');
      fireEvent.click(cancelButton);
    });

    // Should reset the form
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('handles password visibility toggle', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  it('handles RTL layout', () => {
    localStorage.setItem('isRtl', 'true'); 
    render(<Login />);
    expect(screen.getByText('work_email')).toBeInTheDocument();
  });

  it('handles missing location state', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {},
      pathname: '/login',
      search: '',
    });
    render(<Login />);
    expect(screen.getByText('work_email')).toBeInTheDocument();
  });

  it('handles token creation with empty access token', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Auth1dot0: { AccessToken: 'token', ExpiryAt: 'exp' },
        RefreshToken: 'refresh',
        RefreshTokenExpiryAt: 'refreshExp',
        AccessDetail: { AccessToken: '' }
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);
    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });
    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });
    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });
  });

  it('handles token creation with null access token', async () => {
    const mockResponse = {
      Response: [
        { ModeOfLogin: 'Password' }
      ]
    };
    mockLoginmethodsUnwrap.mockResolvedValue(mockResponse);
    mockLoginUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Profiles: [{ ProfileId: '1', SourceName: 'TestProfile' }],
        IdToken: 'idtoken'
      }
    });
    mockCreateTokenUnwrap.mockResolvedValue({
      Context: { StatusCode: 200 },
      Response: {
        Auth1dot0: { AccessToken: 'token', ExpiryAt: 'exp' },
        RefreshToken: 'refresh',
        RefreshTokenExpiryAt: 'refreshExp',
        AccessDetail: { AccessToken: null }
      }
    });

    render(<Login />);
    
    const emailInput = screen.getByDisplayValue('');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('choose_login_methods');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordButton = screen.getByText('login_with_password');
      fireEvent.click(passwordButton);
    });

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue('');
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    });

    await waitFor(() => {
      const loginButton = screen.getByText('login');
      fireEvent.click(loginButton);
    });
  });
}); 