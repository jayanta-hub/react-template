# Authentication Components

This directory contains modern, reusable authentication components for the React application.

## Components

### LoginForm

A comprehensive login form component with email/password authentication and built-in validation.

**Features:**
- Email and password fields with validation
- Password visibility toggle
- Form validation using Formik and Yup
- Loading states and error handling
- Forgot password functionality
- Responsive design

**Usage:**
```tsx
import { LoginForm } from '../components/auth/LoginForm';

<LoginForm
  onSuccess={() => console.log('Login successful!')}
  onForgotPassword={() => console.log('Forgot password clicked')}
/>
```

**Props:**
- `onSuccess?: () => void` - Callback when login is successful
- `onForgotPassword?: () => void` - Callback when forgot password is clicked

### SSOLogin

A Single Sign-On component that supports multiple authentication providers.

**Features:**
- Multiple SSO providers (Google, Microsoft, Apple, GitHub, LinkedIn, Twitter)
- Responsive grid layout
- Hover effects and animations
- Loading states
- Error handling

**Usage:**
```tsx
import { SSOLogin } from '../components/auth/SSOLogin';

<SSOLogin
  onSuccess={() => console.log('SSO login successful!')}
  onError={(error) => console.error('SSO error:', error)}
  isLoading={false}
/>
```

**Props:**
- `onSuccess?: () => void` - Callback when SSO login is successful
- `onError?: (error: string) => void` - Callback when SSO login fails
- `isLoading?: boolean` - Loading state for the component

### LoginPage

A complete login page that combines both traditional login and SSO options using tabs.

**Features:**
- Tabbed interface for different login methods
- Integrated error and success messaging
- Responsive design
- Navigation integration

**Usage:**
```tsx
import { LoginPage } from '../pages/auth/LoginPage';

<LoginPage />
```

## Demo

To see all components in action, visit the `LoginDemo` page:

```tsx
import { LoginDemo } from '../pages/auth/LoginDemo';

<LoginDemo />
```

## Styling

All components use Material-UI (MUI) for consistent styling and theming. The components are designed to work with the existing theme configuration.

## Authentication Flow

### Traditional Login
1. User enters email and password
2. Form validation occurs
3. Mock API call is simulated
4. Success callback is triggered
5. User is redirected (if configured)

### SSO Login
1. User clicks on a provider button
2. Mock SSO redirect is simulated
3. Mock token is generated
4. Success callback is triggered
5. User is redirected (if configured)

## Customization

### Adding New SSO Providers

To add a new SSO provider, update the `SSO_PROVIDERS` array in `SSOLogin.tsx`:

```tsx
const SSO_PROVIDERS: SSOProvider[] = [
  // ... existing providers
  {
    id: 'custom',
    name: 'Custom Provider',
    icon: <CustomIcon />,
    color: '#FF0000',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
];
```

### Styling Customization

Components use MUI's `sx` prop for styling. You can customize colors, spacing, and other properties by modifying the `sx` objects.

## Integration

### With Existing Auth System

These components are designed to work with the existing `useAuth` hook and `AuthService`. They automatically:

- Check authentication status
- Update authentication state
- Handle token management
- Integrate with routing

### With Real APIs

To integrate with real authentication APIs:

1. Replace mock API calls in the components
2. Update the `AuthService` to use real endpoints
3. Configure proper error handling for API responses
4. Set up proper redirect URLs for SSO providers

## Dependencies

- Material-UI (MUI)
- Formik for form management
- Yup for validation
- React Router for navigation
- Custom hooks (`useAuth`)

## Browser Support

Components are built with modern React features and support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

Components include:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Error message association
