import * as yup from 'yup';

export const ideasSettings = {
  requests: {
    model: 'Idea',
    get: 'getIdeaBaseData',
    add: 'addIdea',
    edit: 'editIdea',
    decrypt: ['content'],
  },
  forms: {
    content: yup.string().required(),
    user_id: yup.number().required(),
    room_id: yup.number().required(),
  },
  options: {
    content: {
      label: 'Content',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
    },
    user_id: {
      label: 'User ID',
      defaultValue: '',
      required: true,
      hidden: true,
      isText: false,
    },
    room_id: {
      label: 'Room ID',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
  },
}