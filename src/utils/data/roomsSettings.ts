import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'Rooms';
const item = 'Room';
const model = 'Room';

const rows = [
  {
    id: 0,
    name: 'room_name',
    displayName: 'Name',
  },
  {
    id: 5,
    name: 'description_public',
    displayName: 'Description',
  },
];

const forms = [
  {
    type: 'input',
    label: 'Room Name',
    column: 'room_name',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'text',
    label: 'Description',
    column: 'description_public',
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
