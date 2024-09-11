import { CommentType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

interface CommentFields extends FieldType {
  name: keyof CommentType;
}

interface CommentColumns extends ColumnSettings {
  name: keyof CommentType;
}

const columns = [
  { name: 'idea_id', orderId: 5 },
  { name: 'content', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<CommentColumns>;

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
