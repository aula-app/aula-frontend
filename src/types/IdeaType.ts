export interface Idea {
  displayname: string;
  room_id: number;
  created: string;
  last_update: string;
  id: number;
  content: string;
  sum_likes: number;
  sum_votes: number;
}

export interface IdeasRequest {
  success: Boolean;
  count: Number;
  data: Idea[];
}

export interface SingleIdeaRequest {
  success: Boolean;
  count: Number;
  data: Idea;
}
