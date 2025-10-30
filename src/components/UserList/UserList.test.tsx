import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import UserList from './UserList';
import type { User } from '@/types/user';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Roger Federer',
    username: 'federer',
    email: 'rogerfederer@tennis.com',
    phone: '123-456-7890',
    website: 'rogerfederer.com',
    address: {
      street: 'Main St',
      suite: 'Apt. 1',
      city: 'Swiss',
      zipcode: '10001',
    },
    company: {
      name: 'Laver Corp',
      catchPhrase: 'Tennis Tournament',
      bs: 'sports',
    },
  },
  {
    id: 2,
    name: 'Jay Idzes',
    username: 'jayidzes',
    email: 'jayidzes@timnas.com',
    phone: '098-765-4321',
    website: 'jayidzes.com',
    address: {
      street: 'Second St',
      suite: 'Apt. 2',
      city: 'Sassuolo',
      zipcode: '90001',
    },
    company: {
      name: 'U.S. Sassuolo Calcio',
      catchPhrase: 'Italian Football Club',
      bs: 'Neroverdi',
    },
  },
];

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockUsers),
  } as Response)
);

describe('UserList', () => {
  it('should render loading state initially', () => {
    renderWithProviders(<UserList />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it('should render user list after loading', async () => {
    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Roger Federer')).toBeInTheDocument();
      expect(screen.getByText('Jay Idzes')).toBeInTheDocument();
    });
  });

  it('should display user information in cards', async () => {
    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('rogerfederer@tennis.com')).toBeInTheDocument();
      expect(screen.getByText(/Laver Corp/)).toBeInTheDocument();
    });
  });

  it('should have action buttons for each user', async () => {
    renderWithProviders(<UserList />);

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /view/i });
      const editButtons = screen.getAllByRole('button', { name: /edit/i });

      expect(viewButtons).toHaveLength(2);
      expect(editButtons).toHaveLength(2);
    });
  });

  it('should open add user modal when clicking add button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Roger Federer')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add new user/i });
    await user.click(addButton);

    await waitFor(() => {
      const modalTitle = screen.getByRole('heading', { name: /add new user/i });
      expect(modalTitle).toBeInTheDocument();
    });
  });

  it('should show delete confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);

    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Roger Federer')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const deleteButton = deleteButtons.find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );

    if (deleteButton) {
      await user.click(deleteButton);
      expect(window.confirm).toHaveBeenCalled();
    }
  });
});
