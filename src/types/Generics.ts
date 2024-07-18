import { BoxType } from './scopes/BoxTypes';
import { CommentType } from './scopes/CommentTypes';
import { IdeaType } from './scopes/IdeaTypes';
import { MessageType } from './scopes/MessageTypes';
import { RoomType } from './scopes/RoomTypes';
import { SettingNamesType } from './scopes/SettingsTypes';
import { UserType } from './scopes/UserTypes';

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
