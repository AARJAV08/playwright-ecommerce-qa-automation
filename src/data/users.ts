export interface User {
  username: string;
  password: string;
}

const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
} satisfies Record<string, User>;
