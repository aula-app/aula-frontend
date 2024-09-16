import { IdeaType } from '@/types/Scopes';
import { inputType } from '../formDefaults';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';

interface IdeaFields extends FieldType {
  name: keyof IdeaType;
}

interface IdeaColumns extends ColumnSettings {
  name: keyof IdeaType;
}

const columns = [
  { name: 'title', orderId: 5 },
  { name: 'content', orderId: 6 },
  { name: 'room_id', orderId: 7 },
  { name: 'approved', orderId: 11 },
  { name: 'approval_comment', orderId: 12 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<IdeaColumns>;

const fields = [
  {
    name: 'title',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'content',
    form: inputType.longText,
    required: true,
    role: 20,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      required: true,
      options: 'rooms',
    },
    role: 50,
  },
  {
    name: 'approval_comment',
    form: inputType.longText,
    required: false,
    role: 50,
    phase: 20,
  },
  {
    name: 'approved',
    form: {
      ...inputType.select,
      options: [
        { label: '-', value: 0 },
        { label: 'generics.no', value: -1 },
        { label: 'generics.yes', value: 1 },
      ],
    },
    required: false,
    role: 50,
    phase: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<IdeaFields>;

const requests = {
  name: 'ideas',
  model: 'Idea',
  item: 'Idea',
  items: 'Ideas',
  id: 'idea_id',
  fetch: 'getIdeas',
  get: 'getIdeaBaseData',
  add: 'addIdea',
  edit: 'editIdea',
  delete: 'deleteIdea',
} as DataRequestsType;

export default { fields, columns, requests };
