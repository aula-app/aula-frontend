export interface IdeaType {
  id: number;
  content: string;
  sum_likes: number;
  sum_votes: number;
  number_of_votes: number;
  user_id: number;
  votes_available_per_user: number;
  status: number;
  language_id: number;
  created: string;
  last_update: string;
  hash_id: string;
  order_importance: number;
  info: string;
  updater_id: number;
  room_id: number;
  is_winner: number;
  approved: number;
  approval_comment: null;
  topic_id: number;
  idea_id: number;
  realname: string;
  displayname: string;
  username: string;
  email: string;
  pw: string;
  position: string;
  about_me: string;
  registration_status: null;
  bi: string;
  userlevel: number;
  infinite_votes: null;
  last_login: string;
  presence: null;
  absent_until: null;
  auto_delegation: 0;
  trustee_id: null;
  o1: null;
  o2: null;
  o3: null;
  consents_given: number;
  consents_needed: number;
}

export interface IdeasResponseType {
  success: Boolean;
  count: Number;
  data: IdeaType[];
}

export interface SingleIdeaResponseType {
  success: Boolean;
  count: Number;
  data: IdeaType;
}
