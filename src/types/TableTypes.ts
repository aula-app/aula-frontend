import { ObjectPropByName } from './Generics';
import { UserTypeKeys } from './scopes/UserTypes';

export interface TableRow {
  id: number;
  name: UserTypeKeys;
  displayName: string;
  encryption: boolean;
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

export interface TableResponseType {
  success: Boolean;
  count: Number;
  data: ObjectPropByName[];
}
