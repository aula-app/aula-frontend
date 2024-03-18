export interface IdeaType {
  id: number;
  content: string;
  displayname: string;
  sum_likes: number;
  sum_votes: number;
  room_id: number;
  created: string;
  last_update: string;
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
