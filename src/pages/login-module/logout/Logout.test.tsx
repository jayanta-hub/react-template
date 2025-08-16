import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logout from './Logout';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    // Map specific keys to expected values
    t: (key: string) => {
      const translations: Record<string, string> = {
        'sign_out': 'Sign out',
        // Add other translations as needed
      };
      return translations[key] || key;
    }
  }),
}));
jest.mock('../../../utility/constant', () => ({
  ROUTES: {
    LOGIN: '/login',
  },
}));
jest.mock('../../../assets/images/sign_out_icon.svg', () => 'sign_out_icon.svg');
describe('Logout Component', () => {
  Object.defineProperty(window, 'localStorage', {
    value: { removeItem: jest.fn() },
    writable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: { clear: jest.fn() },
    writable: true,
  });
});
afterEach(() => {
  jest.clearAllMocks();
});
test('Renders logout button when isUserProfile is false', () => {
  render(<Logout isUserProfile={false} />);
  expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
  expect(screen.getByText('logout')).toBeInTheDocument();
});
test('Renders sign-out elements when isUserProfile is true', () => {
  render(<Logout isUserProfile={true} />);
  expect(screen.getByText('Sign out')).toBeInTheDocument();
  const images = screen.getAllByRole('img');
  expect(images.some(img => img.getAttribute('src') === 'sign_out_icon.svg')).toBe(true);
});
test('Opens confirmation dialog when logout button is clicked', async () => {
  render(<Logout isUserProfile={false} />);
  await userEvent.click(screen.getByRole('button', { name: 'logout' }));
  expect(screen.getByText('logout_message')).toBeInTheDocument();
});
test('Closes dialog when No is clicked', async () => {
  render(<Logout isUserProfile={false} />);
  await userEvent.click(screen.getByRole('button', { name: 'logout' }));
  await userEvent.click(screen.getByRole('button', { name: 'No' }));
  await waitFor(() => {
    expect(screen.queryByText('logout_message')).not.toBeInTheDocument();
  });
});

