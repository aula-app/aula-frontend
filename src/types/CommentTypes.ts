export interface Comment {
  id: number;
  content: string;
  sum_likes: number;
  user_id: number;
  status: number;
  created: string;
  last_update: string;
  updater_id: number;
  hash_id: string;
  language_id: number;
  idea_id: number;
  parent_id: number;
}

export interface CommentResponse {
  success: Boolean;
  count: Number;
  data: Comment[];
}