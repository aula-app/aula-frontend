import * as yup from 'yup';

export const ideasSettings = {
  requests: {
    model: 'Idea',
    get: 'getIdeaBaseData',
    add: 'addIdea',
    edit: 'editIdea',
    delete: 'deleteIdea',
    decrypt: ['content'],
  },
  forms: [
    {
      name: 'content',
      label: 'Content',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
      schema: yup.string().required(),
    },
    {
      name: 'user_id',
      label: 'User ID',
      defaultValue: '',
      required: true,
      hidden: true,
      isText: false,
      schema: yup.number().required(),
    },
    {
      name: 'room_id',
      label: 'Room ID',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
      schema: yup.number().required(),
    },
  ]
}