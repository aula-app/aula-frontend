import * as yup from 'yup';

export const roomsSettings = {
  requests: {
    model: 'Room',
    get: 'getRoomBaseData',
    add: 'addRoom',
    edit: 'editRoomData',
    decrypt: [],
  },
  forms: {
    room_name: yup.string().required(),
    description_public: yup.string().required(),
    description_internal: yup.string(),
    username: yup.string().required(),
    position: yup.string().required(),
    userlevel: yup.number().required(),
  },
  options: {
    room_name: {
      label: 'Room Name',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
    description_public: {
      label: 'Public Description',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
    },
    description_internal: {
      label: 'Internal Description',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
    },
  },
}