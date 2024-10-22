import { ObjectPropByName } from './Generics';
import {
  AnnouncementType,
  BoxType,
  BugType,
  CategoryType,
  CommentType,
  GroupType,
  IdeaType,
  MessageType,
  ReportType,
  RoomType,
  UserType,
} from './Scopes';

interface BaseResponseType {
  success: boolean;
  count: number;
  error_code: number;
}

export interface ScopeResponseType extends BaseResponseType {
  data:
    | AnnouncementType
    | BoxType
    | BugType
    | CategoryType
    | CommentType
    | GroupType
    | IdeaType
    | MessageType
    | ReportType
    | RoomType
    | UserType;
}

export interface BoxesResponseType extends BaseResponseType {
  data: BoxType[];
}

export interface CommentsResponseType extends BaseResponseType {
  data: CommentType[];
}

export interface IdeasResponseType extends BaseResponseType {
  data: IdeaType[];
}

export interface RoomsResponseType extends BaseResponseType {
  data: RoomType[];
}

export interface SingleResponseType extends BaseResponseType {
  data: AnnouncementType | BoxType | CommentType | IdeaType | MessageType | RoomType | UserType;
}

export interface SingleBoxResponseType extends BaseResponseType {
  data: BoxType;
}

export interface SingleIdeaResponseType extends BaseResponseType {
  data: IdeaType;
}

export interface SingleUserResponseType extends BaseResponseType {
  data: UserType;
}

export type StatusRequest = { method: string; status: number; callback: () => void | Promise<void> };

export type ConfigRequest = { method: string; args: ObjectPropByName };
