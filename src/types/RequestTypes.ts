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

type FailedResponseType = { success: false };

interface BaseResponseType {
  success: boolean;
  count: number;
  error_code: number;
}

export interface ScopeResponseType extends BaseResponseType {
  data:
    | AnnouncementType[]
    | BoxType[]
    | BugType[]
    | CategoryType[]
    | CommentType[]
    | GroupType[]
    | IdeaType[]
    | MessageType[]
    | ReportType[]
    | RoomType[]
    | UserType[];
}

export type ResponseType = FailedResponseType | ScopeResponseType;

export interface SingleScopeResponseType extends BaseResponseType {
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

export type SingleResponseType = FailedResponseType | SingleScopeResponseType;

export type StatusRequest = { method: string; status: number; callback: () => void | Promise<void> };

export type ConfigRequest = { method: string; args: ObjectPropByName };
