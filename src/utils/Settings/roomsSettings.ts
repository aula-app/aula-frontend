import * as yup from 'yup';

const definitions = {
  name: 'Rooms',
  itemName: 'Room',
};

const requests = {
  model: 'Room',
  method: 'getRooms',
  id: 'room_id',
  get: 'getRoomBaseData',
  add: 'addRoom',
  edit: 'editRoomData',
  delete: 'deleteRoom',
  decrypt: [],
};

const forms = [
  {
    name: 'room_name',
    label: 'Room Name',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'description_public',
    label: 'Public Description',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string().required(),
  },
  {
    name: 'description_internal',
    label: 'Internal Description',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string(),
  },
];

const rows = [
  {
    id: 0,
    name: 'room_name',
    displayName: 'Name',
    encryption: false,
  },
  {
    id: 5,
    name: 'description_public',
    displayName: 'Public description',
    encryption: false,
  },
  {
    id: 6,
    name: 'description_internal',
    displayName: 'Internal description',
    encryption: false,
  },
];

export const roomsSettings = {
  definitions,
  requests,
  forms,
  rows,
};
