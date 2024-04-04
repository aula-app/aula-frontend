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
  userlevel: number;
  infinite_votes: null;
  last_login: string;
  presence: null;
  absent_until: null;
  auto_delegation: number;
  trustee_id: null;
  o1: null;
  o2: null;
  o3: null;
  consents_given: number;
  consents_needed: number;
}

export interface UserResponseType {
  success: Boolean;
  count: Number;
  data: UserType;
}
