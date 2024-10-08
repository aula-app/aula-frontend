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
    name: 'name',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    required: true,
    role: 20,
  },
  {
    name: 'idea_headline',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'idea_content',
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
    name: 'phase_duration_3',
    form: {
      ...inputType.duration,
      type: 'singleDuration',
      required: true,
      options: 'rooms',
    },
    role: 50,
  },
];

const requests = {
  name: 'surveys',
  model: 'Idea',
  item: 'survey',
  items: 'Ideas',
  id: 'idea_id',
  fetch: 'getIdeas',
  get: 'getIdeaBaseData',
  add: 'addSurvey',
  edit: 'editSurvey',
  delete: 'deleteIdea',
} as DataRequestsType;

export default { fields, columns, requests };
