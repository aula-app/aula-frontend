import { CommentType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of CommentType
interface CommentFields extends FieldType {
  name: keyof CommentType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of CommentType
interface CommentColumns extends ColumnSettings {
  name: keyof CommentType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'idea_id', orderId: 5 },
  { name: 'content', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<CommentColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'content',
    form: inputType.longText,
    required: true,
    role: 10,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<CommentFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'comments',
  model: 'Comment',
  item: 'Comment',
  items: 'Comments',
  id: 'comment_id',
  fetch: 'getComments',
  get: 'getCommentBaseData',
  add: 'addComment',
  edit: 'editComment',
  delete: 'deleteComment',
} as DataRequestsType;

export default { fields, columns, requests };
