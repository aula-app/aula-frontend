export interface CommentType {
  id: number;
  content: string;
  sum_likes: number;
  idea_id: number;
  user_id: number;
  hash_id: string;
  language_id: number;
  parent_id: number;
  status: number;
  created: string;
  last_update: string;
  updater_id: number;
}

export interface CommentResponseType {
  success: Boolean;
  count: Number;
  data: CommentType[];
}