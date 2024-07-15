import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'rooms';
const item = 'room';
const model = 'Room';

const rows = [
  {
    id: 0,
    name: 'room_name',
  },
  {
    id: 5,
    name: 'description_public',
  },
];

const forms = [
  {
    type: 'input',
    name: 'room_name',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'text',
    name: 'description_public',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
];

const requests = {
  id: `room_id`,
  fetch: `getRooms`,
  get: `getRoomBaseData`,
  add: `addRoom`,
  edit: `editRoom`,
  delete: `deleteRoom`,
};

export const roomsSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
