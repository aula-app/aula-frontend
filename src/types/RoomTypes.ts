export interface RoomType {
  access_code: string;
  created: string;
  description_internal: string;
  description_public: string;
  hash_id: string;
  id: number;
  internal_info: string;
  last_update: string;
  order_importance: number;
  restrict_to_roomusers_only: number;
  room_name: string;
  status: number;
  updater_id: number;
}

export interface RoomsResponseType {
  success: Boolean;
  count: Number;
  data: RoomType[];
}

export interface SingleRoomResponseType {
  success: Boolean;
  count: Number;
  data: RoomType;
}
