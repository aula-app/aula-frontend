// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;

export type StatusTypes = -1 | 0 | 1 | 2 | 3;

export interface DefaultUpdate {
  id: string;
  idea_id: string;
  topic_id: string | null;
  phase_id: string | null;
  room_id: string;
  title: string;
}

export type InstanceResponse = {
  created: Date;
  id: number;
  last_update: Date;
  online_mode: OnlineOptions;
  revert_to_on_active: 0 | 1;
  revert_to_on_date: Date;
  updater_id: number;
};

export type OnlineOptions = 0 | 1 | 2 | 3 | 4 | 5;
