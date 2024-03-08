export interface IdeaType {
  displayname: string;
  room_id: number;
  created: string;
  last_update: string;
  id: number;
  content: string;
  sum_likes: number;
  sum_votes: number;
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
