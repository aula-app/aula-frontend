export interface IdeaType {
  id: number;
  content: string;
  title: string;
  displayname: string;
  created: string;
  last_updated: string;
  sum_likes: number;
  sum_votes: number;
  sum_comments: number;
  user_id: number;
  status: number;
  language_id: number;
  is_winner: number;
  approved: number;
  approval_comment: null;
  topic_id: number;
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
