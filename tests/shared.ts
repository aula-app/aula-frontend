export const now = new Date();
export const timestring = now.toISOString();
export const timestamp = now.getTime().toString();

export const getHost = () => `http://localhost:3000`;

export type UserData = {
  username: string;
  password: string;
  displayName: string;
  realName: string;
  role: 'user' | 'admin';
  about: string;
};
