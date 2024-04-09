import { UserTypeKeys } from './UserTypes';

export interface TableRow {
  id: number;
  name: UserTypeKeys;
  displayName: string;
  isRestricted: boolean;
}

export interface TableOptions {
  model: 'User' | 'Groups';
  method: 'getUsers' | 'getGroups';
  page: number;
  limit: number;
  orderBy: UserTypeKeys;
  orderAsc: boolean;
  rows: TableRow[];
}
