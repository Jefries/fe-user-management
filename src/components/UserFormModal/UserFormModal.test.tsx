import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import UserFormModal from './UserFormModal';
import type { User } from '@/types/user';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '123-456-7890',
  website: 'test.com',
  address: {
    street: 'Test Street',
    suite: 'Apt. 1',
    city: 'Test City',
    zipcode: '12345',
  },
  company: {
    name: 'Test Company',
    catchPhrase: 'Test Phrase',
    bs: 'test bs',
  },
};

describe('UserFormModal', () => {
  let mockOnOpenChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnOpenChange = vi.fn();
  });

  it('should render add user form when user is null', async () => {
    renderWithProviders(
      <UserFormModal user={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    await waitFor(() => {
      expect(screen.getByText('Add New User')).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: /^name \*/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add user/i })
      ).toBeInTheDocument();
    });
  });

  it('should render edit user form when user is provided', async () => {
    renderWithProviders(
      <UserFormModal
        user={mockUser}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Edit User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /update user/i })
      ).toBeInTheDocument();
    });
  });

  it('should update input values when typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UserFormModal user={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    const nameInput = await screen.findByRole('textbox', { name: /^name \*/i });
    await user.type(nameInput, 'New User');

    expect(nameInput).toHaveValue('New User');
  });

  it('should call onOpenChange when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UserFormModal user={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not render content when closed', () => {
    renderWithProviders(
      <UserFormModal user={null} open={false} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /add user/i })
    ).not.toBeInTheDocument();
  });

  it('should mark required fields as required', async () => {
    renderWithProviders(
      <UserFormModal user={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /^name \*/i })).toBeRequired();
      expect(
        screen.getByRole('textbox', { name: /username \*/i })
      ).toBeRequired();
      expect(screen.getByRole('textbox', { name: /email \*/i })).toBeRequired();
      expect(screen.getByRole('textbox', { name: /phone \*/i })).toBeRequired();
    });
  });
});
