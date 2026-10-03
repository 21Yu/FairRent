import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AuthContext } from '../src/context/AuthContext';
import { AuthProvider } from '../src/context/AuthProvider';
import { useAuth } from '../src/context/AuthContext';
import LoginForm from '../src/components/forms/LoginForm';
import RegisterForm from '../src/components/forms/RegisterForm';
import SideBar from '../src/components/SideBar';
import { BookmarkButton } from '../src/components/cards/BookmarkButton';
import * as api from '../src/services/api';
import type { ListingType } from '../src/models/ListingTypes';

vi.mock('../src/services/api', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  updateCurrentUser: vi.fn(),
  saveListing: vi.fn(),
  deleteListing: vi.fn(),
  getToken: vi.fn(() => null),
  registerUser: vi.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the email and password to the auth handler', async () => {
    const handleLogin = vi.fn().mockResolvedValue(undefined);

    render(
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          handleLogin,
          handleLogout: vi.fn(),
          handleUpdateProfile: vi.fn(),
          toggleSaveListing: vi.fn(),
          isSaved: vi.fn(() => false),
        }}
      >
        <LoginForm />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securepassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('user@example.com', 'securepassword123');
    });
  });
});

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a user with the entered details', async () => {
    const registerUserMock = vi.mocked(api.registerUser).mockResolvedValue({
      id: 'user-1',
      email: 'new@example.com',
      user_name: 'New User',
      saved_listings: [],
      is_admin: false,
    });

    render(<RegisterForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith('New User', 'new@example.com', 'password123');
    });
  });
});

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and toggles a saved listing for the current user', async () => {
    const mockedUser = {
      id: 'user-1',
      email: 'me@example.com',
      user_name: 'Me',
      saved_listings: [],
      is_admin: false,
    };

    vi.mocked(api.login).mockResolvedValue(mockedUser);
    vi.mocked(api.saveListing).mockResolvedValue(undefined);
    vi.mocked(api.deleteListing).mockResolvedValue(undefined);

    function AuthProbe() {
      const { user, handleLogin, toggleSaveListing } = useAuth();

      return (
        <>
          <div>{user ? user.email : 'logged-out'}</div>
          <button onClick={() => handleLogin('me@example.com', 'password')}>login</button>
          <button onClick={() => toggleSaveListing('listing-1')}>toggle-save</button>
        </>
      );
    }

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('me@example.com', 'password');
      expect(screen.getByText('me@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /toggle-save/i }));

    await waitFor(() => {
      expect(api.saveListing).toHaveBeenCalledWith('listing-1');
    });
  });
});

describe('SideBar', () => {
  it('renders results and sorts by lowest price first', () => {
    const listings: ListingType[] = [
      {
        _id: 'b',
        city: 'Toronto',
        province: 'Ontario',
        address: '900 Oak Ave',
        latitude: 43.7,
        longitude: -79.4,
        lease_term: 12,
        type: 'Apartment',
        price: 3300,
        beds: 2,
        baths: 1,
        sq_feet: 900,
        furnishing: false,
        smoking: false,
        cats: true,
        dogs: false,
        location_freq: 2,
        price_sq_ft: 3.67,
        availability_days: 10,
      },
      {
        _id: 'a',
        city: 'Toronto',
        province: 'Ontario',
        address: '200 Main St',
        latitude: 43.6,
        longitude: -79.5,
        lease_term: 12,
        type: 'Condo',
        price: 2100,
        beds: 1,
        baths: 1,
        sq_feet: 700,
        furnishing: true,
        smoking: false,
        cats: false,
        dogs: true,
        location_freq: 1,
        price_sq_ft: 3,
        availability_days: 5,
      },
    ];

    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: null,
            loading: false,
            handleLogin: vi.fn(),
            handleLogout: vi.fn(),
            handleUpdateProfile: vi.fn(),
            toggleSaveListing: vi.fn(),
            isSaved: vi.fn(() => false),
          }}
        >
          <SideBar listings={listings} loading={false} selectedListingId="b" />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Results \(2\)/i)).toBeInTheDocument();

    const cards = Array.from(container.querySelectorAll('li'));
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('200 Main St');
    expect(cards[1]).toHaveTextContent('900 Oak Ave');
  });
});

describe('BookmarkButton', () => {
  it('prompts the user to log in before saving a listing', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          handleLogin: vi.fn(),
          handleLogout: vi.fn(),
          handleUpdateProfile: vi.fn(),
          toggleSaveListing: vi.fn(),
          isSaved: vi.fn(() => false),
        }}
      >
        <BookmarkButton listingId="listing-1" />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /save listing/i }));
    expect(alertSpy).toHaveBeenCalledWith('Please log in to save listings');
  });

  it('calls toggleSaveListing when a logged in user clicks the bookmark', () => {
    const toggleSaveListing = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          user: { id: 'u1', email: 'u@example.com', user_name: 'U', saved_listings: [], is_admin: false },
          loading: false,
          handleLogin: vi.fn(),
          handleLogout: vi.fn(),
          handleUpdateProfile: vi.fn(),
          toggleSaveListing,
          isSaved: vi.fn(() => false),
        }}
      >
        <BookmarkButton listingId="listing-1" />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /save listing/i }));
    expect(toggleSaveListing).toHaveBeenCalledWith('listing-1');
  });
});
