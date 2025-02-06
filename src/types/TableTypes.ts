import { PossibleFields, UserType } from './Scopes';

export interface TableRow {
  id: number;
  name: keyof UserType;
}

export interface TableOptions {
  model: 'User' | 'Groups';
  method: 'getUsers' | 'getGroups';
  page: number;
  limit: number;
  orderBy: keyof UserType;
  orderAsc: boolean;
  rows: TableRow[];
}

export interface TableResponseType {
  success: Boolean;
  count: Number;
  data: PossibleFields[];
}
