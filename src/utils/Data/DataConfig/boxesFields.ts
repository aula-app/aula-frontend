import { BoxType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

interface BoxFields extends FieldType {
  name: keyof BoxType;
}

interface BoxColumns extends ColumnSettings {
  name: keyof BoxType;
}

const columns = [
  { name: 'name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'room_id', orderId: 7 },
  { name: 'phase_id', orderId: 8 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<BoxColumns>;

const fields = [
  {
    name: 'name',
    form: inputType.shortText,
    required: true,
    role: 30,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    required: false,
    role: 30,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      options: 'rooms',
    },
    required: true,
    role: 30,
  },
  {
    name: 'phase_id',
    form: {
      type: 'phaseSelect',
      defaultValue: 10,
    },
    required: true,
    role: 30,
  },
  {
    name: ['phase_duration_1', 'phase_duration_2', 'phase_duration_3', 'phase_duration_4'],
    form: inputType.duration,
    required: true,
    role: 30,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<BoxFields>;

const requests = {
  name: 'boxes',
  model: 'Topic',
  item: 'Topic',
  items: 'Topics',
  id: 'topic_id',
  fetch: 'getTopics',
  get: 'getTopicBaseData',
  add: 'addTopic',
  edit: 'editTopic',
  delete: 'deleteTopic',
  move: {
    model: 'Idea',
    add: 'addIdeaToTopic',
    remove: 'removeIdeaFromTopic',
    get: 'getIdeasByTopic',
    target: 'ideas',
    targetId: 'idea_id',
  },
} as DataRequestsType;

export default { fields, columns, requests };
