export interface GroupType {
  id: number;
  group_name: string;
  description_public: string;
  description_internal: string;
  status: number;
  internal_info: string;
  created: string;
  last_update: string;
  updater_id: number;
  hash_id: string;
  access_code: string;
  order_importance: number;
  vote_bias: number;
}
