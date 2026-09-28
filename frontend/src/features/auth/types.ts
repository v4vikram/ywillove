export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'customer' | 'admin';
};

export type SessionResponse = {
  user: User;
  accessToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  phone?: string;
};
