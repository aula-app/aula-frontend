import { BoxType, CommentType, IdeaType, MessageType, RoomType, UserType } from './Scopes';
import { SettingNamesType } from './SettingsTypes';

// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;
export type DatabaseResponseData = BoxType | CommentType | IdeaType | MessageType | RoomType | UserType;

export interface SingleResponseType {
  success: Boolean;
  count: Number;
  data: DatabaseResponseData;
}

export interface DatabaseResponseType {
  success: Boolean;
  count: Number;
  data: DatabaseResponseData[];
}

export type ColorTypes = 'secondary' | 'warning' | 'error' | 'inherit' | 'primary' | 'success' | 'info';
export type AlterTypes = 'add' | 'edit' | 'delete' | 'report' | 'bug';

export interface EditDataType {
  type: AlterTypes;
  element: SettingNamesType;
  onClose: () => void;
  id?: number;
}
