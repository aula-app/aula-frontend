import { RoomPhases } from "./RoomTypes";

export interface BoxType {
  id: number;
  name: string;
  description_public: string;
  ideas_num: number;
  created: string;
  last_update: string;
  hash_id: string;
  updater_id: number;
  room_id: number;
  phase_id: RoomPhases;
  phase_duration_0: number;
  phase_duration_1: number;
  phase_duration_2: number;
  phase_duration_3: number;
  phase_duration_4: number;
}

export interface BoxesResponseType {
  success: Boolean;
  count: Number;
  data: BoxType[];
}

export interface BoxResponseType {
  success: Boolean;
  count: Number;
  data: BoxType;
}