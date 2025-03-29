export interface User {
  id: number;
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
  name: string;
}

export interface Record {
  id: number;
  title: string;
  description: string;
  userId: number;
}