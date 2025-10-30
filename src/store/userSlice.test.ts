import { describe, it, expect } from 'vitest';
import userReducer, { addUser, updateUser, deleteUser } from './userSlice';
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

describe('userSlice', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual({
      users: [],
      loading: false,
      error: null,
    });
  });

  it('should handle addUser', () => {
    const actual = userReducer(undefined, addUser(mockUser));
    expect(actual.users).toHaveLength(1);
    expect(actual.users[0]).toEqual(mockUser);
  });

  it('should handle updateUser', () => {
    const initialState = {
      users: [mockUser],
      loading: false,
      error: null,
    };

    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const actual = userReducer(initialState, updateUser(updatedUser));

    expect(actual.users[0].name).toBe('Updated Name');
  });

  it('should handle deleteUser', () => {
    const initialState = {
      users: [mockUser],
      loading: false,
      error: null,
    };

    const actual = userReducer(initialState, deleteUser(1));
    expect(actual.users).toHaveLength(0);
  });

  it('should not delete user if id does not exist', () => {
    const initialState = {
      users: [mockUser],
      loading: false,
      error: null,
    };

    const actual = userReducer(initialState, deleteUser(999));
    expect(actual.users).toHaveLength(1);
  });
});
