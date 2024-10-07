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
  { name: 'name', orderId: 0 },
  { name: 'description_public', orderId: 0 },
  { name: 'phase_duration_3', orderId: 0 },
  { name: 'idea_headline', orderId: 5 },
  { name: 'idea_content', orderId: 6 },
  { name: 'room_id', orderId: 7 },
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
    name: ['custom_field1', 'custom_field2'],
    form: inputType.custom,
    required: false,
    role: 30,
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
  add: 'addSurvey',
  edit: 'editSurvey',
  delete: 'deleteIdea',
} as DataRequestsType;

export default { fields, columns, requests };
