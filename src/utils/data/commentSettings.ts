import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Comments';
const item = 'Comment';
const model = 'Comment';

const rows = [
  {
    id: 5,
    name: 'content',
    displayName: 'comment',
  },
  {
    id: 2,
    name: 'created',
    displayName: 'Created',
  },
  {
    id: 3,
    name: 'last_update',
    displayName: 'Last Updated',
  },
];

const forms = [
  {
    type: 'text',
    label: 'Comment',
    column: 'content',
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
