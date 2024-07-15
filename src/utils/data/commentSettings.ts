import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'comments';
const item = 'comment';
const model = 'Comment';

const rows = [
  {
    id: 5,
    name: 'content',
  },
  {
    id: 2,
    name: 'created',
  },
  {
    id: 3,
    name: 'last_update',
  },
];

const forms = [
  {
    type: 'text',
    name: 'content',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
];

const requests = {
  id: 'comment_id',
  fetch: 'getComments',
  get: 'getCommentBaseData',
  add: 'addComment',
  edit: 'editComment',
  delete: 'deleteComment',
};

export const commentSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
