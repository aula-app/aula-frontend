export interface UserType {
  id: number;
  realname: string;
  displayname: string;
  username: string;
  email: string;
  about_me: string;
  avatar?: string;
  pw: string;
  position: string;
  hash_id: string;
  registration_status: null;
  status: number;
  created: string;
  last_update: string;
  updater_id: number;
  bi: string;
  userlevel: string;
  infinite_votes: string;
  last_login: string;
  presence: string;
  absent_until: string;
  auto_delegation: number;
  trustee_id: string;
  o1: string;
  o2: string;
  o3: string;
  consents_given: number;
  consents_needed: number;
}

export interface UsersResponseType {
  success: Boolean;
  count: Number;
  data: UserType[];
}

export interface SingleUserResponseType {
  success: Boolean;
  count: Number;
  data: UserType;
}

export type UserTypeKeys = keyof {
  [P in keyof UserType as UserType[P] extends string ? P: never]: any
}

export interface UsersResponseType {
  success: Boolean;
  count: Number;
  data: UserType[];
}
