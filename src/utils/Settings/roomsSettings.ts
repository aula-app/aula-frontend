import * as yup from 'yup';

export const roomsSettings = {
  requests: {
    model: 'Room',
    get: 'getRoomBaseData',
    add: 'addRoom',
    edit: 'editRoomData',
    delete: 'deleteRoom',
    decrypt: [],
  },
  forms: [
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
  ]
}